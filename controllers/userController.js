const { User, Thought } = require('../models');

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .populate('thoughts friends');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { username: req.body.username },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      const thought = await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ user, thought, message: 'User and associated thought deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async addFriend(req, res) {
    try {
      const friend = await User.findOne({ _id: req.params.friendId });

      if (!friend) {
        return res.status(404).json({ message: 'The user to be added as friend is not exist' });
      }

      const user = await User.findByIdAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: friend._id } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteFriend(req, res) {
    try {
      const friend = await User.findOne({ _id: req.params.friendId });

      if (!friend) {
        return res.status(404).json({ message: 'The user to be added as friend is not exist' });
      }

      const user = await User.findByIdAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: friend._id } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }
};