import ErrorResponse from "../utils/ErrorResponse.js";
import Post from "../models/post.js";
import Tag from "../models/tags.js";
import Bookmark from "../models/bookmarks.js";
import Follower from "../models/follower.js";
import { Op } from "sequelize";


//search
const getPosts = async (req, res) => {
  try {

    let questions = {};
    let { filter, page, limit, type } = req.query;
    console.log(filter);
    if (!filter && !page && !limit) {
      questions = await Post.findAll({ where: { type } });
    } else {
      let offset = 0;
      let parsedLimit = parseInt(limit);


      if (page) {
        const parsedPage = parseInt(page);
        offset = (parsedPage - 1) * parsedLimit;
      }
      if(!filter) {filter="";}
      questions = await Post.findAll(
        {
          offset,
          limit: parsedLimit,
          where: { [Op.and] : [{type}, {[Op.or]:[{title: {[Op.like]:`%${filter}%`}},{content: {[Op.like]:`%${filter}%`}}]}] },
        },

        
      );
    }

    res.json(questions );
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching questions" });
  }
};

const getPostById = async (req, res) => {
  const {id} = req.params;
  try {
    const post = await Post.findByPk(id);
 
    if(!post) return res.status(404).json({ message: "post not found" });
    const relatedComments = await Post.findAll({where: {refId : id, type:"comment"}});
    const relatedAnswers = await Post.findAll({where: {refId : id, type:"answer"}});
    let answersArray =  [];
    relatedAnswers.forEach(async (e)=>{
      relCommentsToAnswer = await Post.findAll({where: {refId : e.id, type:"comment"}});
      answersArray.push({...e, relComments: relCommentsToAnswer});
    });
    const responseObject = {mainPost: {...post, comments :relatedComments}, answers: [...answersArray]};
    res.status(200).json(responseObject);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching post" });
  }
 
};

const createAIPost = async (req, res) => {};

const createPost = async (req, res) => {
  try {
    let parentPost = {};
    if(req.body.refId!=null){
      parentPost = await Post.findByPk(req.body.refId);
      if(!parentPost) return res.status(404).json({ message: "post not found" });
    }
        
    const post = await Post.create(req.body);
    // If Post is related to a parentPost, then set Answer/Commentfields of parentPost
    if(post.refId!=null){
      
      if(post.type=="answer"){
        parentPost.numberOfAnswers +=1;
        parentPost.latestAnswerDate = Date.now();
        await parentPost.save();
      } else if(post.type=="comment"){
        parentPost.numberOfComments +=1;
        parentPost.latestCommentDate = Date.now();
        await parentPost.save();
      }
    }

    res.status(201).json({message:"Post created successfully", createdPost:post});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating post" });
  }
  


};

const updatePost = async (req, res) => {};

const deletePost = async (req, res) => {};


const getBookmarks = async (req, res) => {};

const createBookmark = async (req, res) => {};

const deleteBookmark = async (req, res) => {};

const getTags = async (req, res) => {};

const createTag = async (req, res) => {};

const updateTag = async (req, res) => {};

const deleteTag = async (req, res) => {};

export {
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
