import ErrorResponse from "../utils/ErrorResponse.js";
import Post from "../models/post.js";
import Tag from "../models/tags.js";
import Bookmark from "../models/bookmarks.js";
import Follower from "../models/follower.js";

const getQuestions = async (req, res) => {
  try {
    let questions = {};
    let { filter, page, limit } = req.query;
    if (!filter && !page && !limit) {
      questions = await Post.findAll({ where: { type: "question" } });
    } else {
      let offset = 0;
      let parsedLimit = 151;

      if (page && limit) {
        const parsedPage = parseInt(page);
        parsedLimit = parseInt(limit);
        offset = (parsedPage - 1) * parsedLimit;
      }
      questions = await Post.findAll(
        {
          where: { filter, type: "question" },
        },
        offset,
        parsedLimit
      );
    }

    res.json({ questions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching questions" });
  }
};

const getQuestionById = async (req, res) => {};

const createAIPost = async (req, res) => {};

const createPost = async (req, res) => {};

const updatePost = async (req, res) => {};

const deletePost = async (req, res) => {};

const getBlogs = async (req, res) => {};

const getBlogById = async (req, res) => {};

const getBookmarks = async (req, res) => {};

const createBookmark = async (req, res) => {};

const deleteBookmark = async (req, res) => {};

const getTags = async (req, res) => {};

const createTag = async (req, res) => {};

const updateTag = async (req, res) => {};

const deleteTag = async (req, res) => {};

export {
  getQuestions,
  getQuestionById,
  createPost,
  updatePost,
  deletePost,
  getBlogs,
  getBlogById,
  getBookmarks,
  createBookmark,
  deleteBookmark,
  getTags,
  createTag,
  deleteTag,
  createAIPost,
  updateTag,
};
