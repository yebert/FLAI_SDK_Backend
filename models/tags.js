import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const Tag = sequelize.define(
  "tags",
  {
    tagName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  { paranoid: true }
);

Tag.sync({ force: true });

export default Tag;
