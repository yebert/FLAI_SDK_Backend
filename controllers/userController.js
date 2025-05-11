import ErrorResponse from "../utils/ErrorResponse.js";
import User from "../models/user.js";
import Follower from "../models/follower.js";

const getUsers = async (req, res) => {
  try {
    console.log(req.headers);
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ message: "user not found" });
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//authController.signUp()
const createUser = async (req, res) => {};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const dbResponse = await User.destroy({ where: { id } });
    res.json({ message: "User successfully deleted." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);

  try {
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });
    const update = await user.update(req.body);
    res
      .status(200)
      .json({ message: "User successfully updated.", user: update });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

const createFollowerConnection = async (req, res) => {
  const { id } = req.params;
  const { fId } = req.body;
  try {
    if (id != fId) {
      const followedUser = await User.findByPk(id);
      if (!followedUser)
        return res.status(404).json({ message: "User not found" });
      const follower = await User.findByPk(fId);
      if (!follower) return res.status(404).json({ message: "User not found" });
      const establishedConnection = Follower.create({
        followedUserId: id,
        followerId: fId,
      });
      followedUser.numberOfFollowers += 1;
      await followedUser.save();

      res.status(201).json({
        message: "Follow successfully created",
        data: establishedConnection,
      });
    } else {
      res.status(409).json({ message: "You cannot follow yourself" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

const deleteFollowerConnection = async (req, res) => {
  const { id } = req.params;
  const { fId } = req.body;
  try {
    if (id != fId) {
      const followedUser = await User.findByPk(id);
      if (!followedUser)
        return res.status(404).json({ message: "User not found" });
      const follower = await User.findByPk(fId);
      if (!follower) return res.status(404).json({ message: "User not found" });
      const establishedConnection = await Follower.findOne({
        where: {
          followedUserId: id,
          followerId: fId,
        },
      });
      if (!establishedConnection) {
        return res.status(404).json({ message: "Follow not found" });
      }
      await establishedConnection.destroy();
      followedUser.numberOfFollowers -= 1;
      await followedUser.save();

      res.status(201).json({
        message: "Follow successfully deleted",
        data: establishedConnection,
      });
    } else {
      res.status(400).json({ message: "You cannot unfollow yourself" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

const getAllFollowers = async (req, res) => {
  const { id } = req.params;
  try {
    const returnArray = [];
    const myFollowerConnections = await Follower.findAll({
      where: { followedUserId: id },
    });
    if (myFollowerConnections.length > 0) {
      myFollowerConnections.forEach(async (e) => {
        let currentFollower = await User.findByPk(e.id);
        await returnArray.push(currentFollower);
      });
    }

    res.status(200).json(returnArray);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

export {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getUserById,
  createFollowerConnection,
  deleteFollowerConnection,
  getAllFollowers,
};
