import sequelize from "index.js";
import User from "../models/user.js";
import UserInformation from "../models/userInformation.js";

UserInformation.hasOne(User, { foreignKey: "uIID" });
User.belongsTo(UserInformation, { foreignKey: "uIID" });

sequelize.sync();

export { UserInformation, User };
