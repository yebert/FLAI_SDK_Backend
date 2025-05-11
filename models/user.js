import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const User = sequelize.define(
  "user",
  {
    uIID: {
      type: DataTypes.STRING,
      allowNull: false,
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
