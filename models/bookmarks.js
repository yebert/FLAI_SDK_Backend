import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const Bookmark = sequelize.define(
  "bookmark",
  {
    postID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { paranoid: true }
);

Bookmark.sync();

export default Bookmark;
