import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const UserInformation = sequelize.define(
  "userInformation",
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
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
  },
  { paranoid: true }
);

UserInformation.sync();

export default UserInformation;
