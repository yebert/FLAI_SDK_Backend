import ErrorResponse from "../utils/ErrorResponse.js";
import Post from "../models/post.js";
import Tag from "../models/tags.js";
import Bookmark from "../models/bookmarks.js";
import Follower from "../models/follower.js";
import { Op } from "sequelize";
import User from "../models/user.js";
import { GoogleGenAI } from "@google/genai";

const model = "gemini-2.0-flash";
const systemInstruction =
  "You are a Senior Web Developer. Keep your answers concise.  explain concepts and provide code where applicable.";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

//search
const searchPosts = async (req, res) => {
  try {
    const {searchString, type}= req.body;
  let returnArray = [];
  let allPosts = []
  if(type==null){
    allPosts = await Post.findAll({
              where: {[Op.or]: [
                { type: "question" },
                { type: "blog" },
              ],},
              order: [["createdAt", "DESC"]],
            });    
  } else {
    allPosts = await Post.findAll({
        where: { type },
        order: [["createdAt", "DESC"]],
      });
  }
  let allPostsMap = allPosts.map((e)=>e.dataValues);
  
  let searchStringArray = searchString.trim().toLowerCase().split(" ");
  console.log(searchStringArray);
  for (const p of allPostsMap){
    
    let matchesTitle = 0;
    let matchesTag = 0;
    let matchesContent = 0
    let tagsArrayOfPost = p.tags.length > 0? p.tags.map((e)=> e.toLowerCase()) : [];
    let title = p.title.toLowerCase();
    let content = p.content.toString().toLowerCase();
    console.log(tagsArrayOfPost)
    for (const s of searchStringArray){
      console.log(s);
      if(title.includes(s) ){
        matchesTitle+=1;
      }
      if(content.includes(s) ){
        matchesContent+=1;
      } 
      if(tagsArrayOfPost.includes(s)){
        matchesTag+=1;
      }       
    }


    if(matchesTag!==0 || matchesTitle!==0 || matchesContent!==0){
      let searchResult = {...p, searchRank: matchesTag+matchesTitle+matchesContent}
      returnArray.push(searchResult);
    }    
  }
  returnArray.sort((a,b)=>b.searchRank - a.searchRank);
  res.status(200).json(returnArray);
  } catch (error) {
     console.log(error);
    res.status(500).json({ error: "Error searching questions" });
  }
};

const getPosts = async (req, res) => {
  try {
    let posts = [];
    let { filter, page, limit, type } = req.query;
    console.log(filter);
    if (!filter && !page && !limit) {
      posts = await Post.findAll({
        where: { type },
        order: [["createdAt", "DESC"]],
      });
    } else {
      let offset = 0;
      let parsedLimit = parseInt(limit);

      if (page) {
        const parsedPage = parseInt(page);
        offset = (parsedPage - 1) * parsedLimit;
      }
      if (!filter) {
        filter = "";
      }
      posts = await Post.findAll({
        offset,
        limit: parsedLimit,
        where: {
          [Op.and]: [
            { type },
            {
              [Op.or]: [
                { title: { [Op.like]: `%${filter}%` } },
                { content: { [Op.like]: `%${filter}%` } },
              ],
            },
          ],
        },
      });
    }
    const returnPostArray = [];
    posts.forEach((e) => {
      returnPostArray.push(e.dataValues);
    });
    res.json({ posts: returnPostArray });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching questions" });
  }
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);

    if (!post) return res.status(404).json({ message: "post not found" });
    const user = await User.findByPk(post.userId);
    const relatedComments = await Post.findAll({
      where: { refId: id, type: "comment" },
    });
    
    let relatedCommentsArray = [];
    for (const rc of relatedComments) {
      let cUser = await User.findByPk(rc.userId);
      relatedCommentsArray.push({
        ...rc.dataValues,
        userName: cUser.name,
        image: cUser.imageURL,
      });
    }
    let hasAIAnswer = false;
    const relatedAnswers = await Post.findAll({
      where: { refId: id, type: "answer" },
    });
    
    let answersArray = [];
    for (const e of relatedAnswers) {
      
      let answerUser = await User.findByPk(e.userId);
      if(e.userId == 0) hasAIAnswer=true;
           
      let rCtA = [];
      let relCommentsToAnswer = await Post.findAll({
        where: { refId: e.id, type: "comment" },
      });
      for (const r of relCommentsToAnswer) {
        
        let commentUser = await User.findByPk(r.userId);
        rCtA.push({
          ...r.dataValues,
          userName: commentUser.name,
          image: commentUser.imageURL,
        });
      }
      
      answersArray.push({
        ...e.dataValues,
        userName: answerUser.name,
        image: answerUser.imageURL,
        comments: [...rCtA],
      });
    }
    
    post.viewCount += 1;
    await post.save();
    const responseObject = {
      mainPost: {
        ...post.dataValues,
        userName: user.name,
        image: user.imageURL,
        comments: [...relatedCommentsArray],
      },
      answers: [...answersArray],
      hasAIAnswer
    };
    
    res.status(200).json(responseObject);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching post" });
  }
};

const createAIPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const response = await ai.models.generateContent({
      model,
      config: {
        systemInstruction,
      },
      contents: message,
    });

    const aiAnswer = {
      content: response.text,
      isAIAnswer: true,
      userId: 0,
      type: "answer",
      refId: id,
    };
    await Post.create(aiAnswer);
    const refObject = await Post.findByPk(id);
    refObject.numberOfAnswers+=1;
    await refObject.save();
    res.json({
      message,
      aiResponse: {
        ...aiAnswer,
        comments: [],
        userName: "Robo Pinta",
        image:
          "https://res.cloudinary.com/dtgshnrcb/image/upload/v1747164078/bmg6rz2lpdqv6p745mad.png",
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating AI post" });
  }
};

const createPost = async (req, res) => {
  try {
    let parentPost = {};
    if (req.body.refId != null) {
      parentPost = await Post.findByPk(req.body.refId);
      if (!parentPost)
        return res.status(404).json({ message: "post not found" });
    }
    const user = await User.findByPk(req.body.userId);
    if (!user) return res.status(404).json({ message: "user not found" });

    const post = await Post.create(req.body);
    // If Post is related to a parentPost, then set Answer/Commentfields of parentPost
    if (post.refId != null) {
      const user = await User.findByPk(parentPost.userId);
      const thisUser = await User.findByPk(post.userId);
      if (post.type == "answer") {
        parentPost.numberOfAnswers += 1;
        parentPost.latestAnswerDate = Date.now();
        await parentPost.save();
        user.latestAnswerToOwnPost = Date.now();
        await user.save();
        thisUser.points += 5;
        await thisUser.save();
      } else if (post.type == "comment") {
        parentPost.numberOfComments += 1;
        parentPost.latestCommentDate = Date.now();
        await parentPost.save();
        user.latestCommentToOwnPost = Date.now();
        await user.save();
        thisUser.points += 1;
        await thisUser.save();
      }
    } else {
      const user = await User.findByPk(post.userId);
      if (post.type == "question") {        
        user.numberOfPosts += 1;
        user.points += 10;
        await user.save();
      } else if (post.type == "blog") {
        user.numberOfBlogs += 1;
        user.points += 15;
        await user.save();
      }
      let interestsOfUser = user.interests;
      for (const t in post.tags){
        interestsOfUser.push(t);
      }
      let setOfInterests = new Set(interestsOfUser);
      let interestsToSave = [...setOfInterests];
      user.interests = interestsToSave;
      await user.save();
    }

    res.status(201).json({
      message: "Post created successfully",
      createdPost: {
        ...post.dataValues,
        userName: user.name,
        image: user.imageURL,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating post" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { user } = req.user;
    const { id } = req.params;
    const post = await Post.findByPk(id);

    if (!post) return res.status(404).json({ message: "post not found" });
    if (post.userId != user.id)
      return res.status(403).json({ message: "forbidden!" });
    await post.update(req.body);
    res.status(200).json({ message: "Post successfully updated", post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating post" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { user } = req.user;
    const { id } = req.params;
    const post = await Post.findByPk(id);

    if (!post) return res.status(404).json({ message: "post not found" });
    if (post.userId != user.id)
      return res.status(403).json({ message: "forbidden!" });
    const relatedComments = await Post.findAll({
      where: { refId: id, type: "comment" },
    });
    const relatedAnswers = await Post.findAll({
      where: { refId: id, type: "answer" },
    });
    const postUser = await User.findByPk(post.userId);
    await post.destroy();
    switch (post.type) {
      case "question": {
        postUser.numberOfPosts -= 1;
        postUser.points -= 10;
        await postUser.save();
        break;
      }
      case "blog": {
        postUser.numberOfBlogs -= 1;
        postUser.points -= 15;
        await postUser.save();
        break;
      }
      case "answer": {
        postUser.points -= 5;
        await postUser.save();
        break;
      }
      case "comment": {
        postUser.points -= 1;
        await postUser.save();
        break;
      }
    }
    relatedAnswers.forEach(async (e) => {
      relCommentsToAnswer = await Post.findAll({
        where: { refId: e.id, type: "comment" },
      });
      await e.destroy();
      relCommentsToAnswer.forEach(async (c) => {
        await c.destroy();
      });
    });
    relatedComments.forEach(async (rc) => {
      await rc.destroy();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting post" });
  }
};

const getBookmarks = async (req, res) => {
  try {
    const { id } = req.params;
    const bookmarks = await Bookmark.findAll({ where: { userID: id } });
    res.status(200).json(bookmarks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching bookmarks" });
  }
};

const createBookmark = async (req, res) => {
  try {
    const checkBookmark = await Bookmark.findOne({
      where: { userID: req.body.userID, postID: req.body.postID },
    });
    if (checkBookmark)
      return res.status(409).json({ message: "Bookmark already set" });
    const bookmark = await Bookmark.create(req.body);
    res
      .status(201)
      .json({ message: "Bookmark successfully created", bookmark });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching bookmarks" });
  }
};

const deleteBookmark = async (req, res) => {
  try {
    const { user } = req.user;
    const { id } = req.params;
    const bookmark = await Bookmark.findByPk(id);
    if (!bookmark)
      return res.status(404).json({ message: "Bookmark not found" });
    if (bookmark.userID != user.id)
      return res.status(403).json({ message: "forbidden!" });
    await bookmark.destroy();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting bookmark" });
  }
};

const getTags = async (req, res) => {
  try {
    const tags = await Tag.findAll();
    res.status(200).json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching tags" });
  }
};

const createTag = async (req, res) => {
  try {
    //Check if Tag already exists
    const checkTag = await Tag.findOne({ tagName: req.body.tagName });
    if (checkTag) return res.status(409).json({ message: "Tag already in DB" });
    const tag = await Tag.create(req.body);
    res.status(201).json({ message: "Tag successfully created", tag });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating tag" });
  }
};

const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByPk(id);
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    tag.isAccepted = true;
    await tag.save();
    res.status(200).json({ message: "Tag successfully accepted", tag });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating tag" });
  }
};

const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findByPk(id);
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    await tag.destroy();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting tag" });
  }
};

export {
  searchPosts,
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getBookmarks,
  createBookmark,
  deleteBookmark,
  getTags,
  createTag,
  deleteTag,
  createAIPost,
  updateTag,
};
