import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const User = sequelize.define(
  "user",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageURL: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    uIID: {
      type: DataTypes.STRING,
      allowNull: true,
    },   
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    numberOfPosts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    numberOfFollowers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    numberOfBlogs: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    latestLogin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    latestLikeToOwnPost: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    latestCommentToOwnPost: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    latestAnswerToOwnPost: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    interests: {
      allowNull: false,
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    batches: {
      allowNull: false,
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
  },
  { paranoid: true }
);

User.sync();

export default User;
