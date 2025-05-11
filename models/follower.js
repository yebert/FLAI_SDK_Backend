import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const Follower = sequelize.define(
  "follower",
  {
    followedUserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    followerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { paranoid: true }
);

Follower.sync();

export default Follower;
