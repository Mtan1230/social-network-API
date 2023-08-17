const { User, Thought } = require('../models');

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find().select('-__v -reactions._id');
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async createThought(req, res) {
    try {
      const user = await User.findOne({ username: req.body.username });

      if (!user) {
        return res.status(404).json({ message: 'No user with that username' });
      }

      const thought = await Thought.create({
        thoughtText: req.body.thoughtText,
        username: user.username,
      });

      await User.updateOne({ _id: user._id }, { $addToSet: { thoughts: thought._id } });

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v -reactions._id');

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { thoughtText: req.body.thoughtText },
        { new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      const user = await User.findOneAndUpdate(
        { username: thought.username },
        { $pull: { thoughts: thought._id } }
      );
      res.json({ thought, message: 'Thought is deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async createReaction(req, res) {
    try {
      const user = await User.findOne({ username: req.body.username });

      if (!user) {
        return res.status(404).json({ message: 'No user with that username' });
      }

      const reaction = {
        reactionBody: req.body.reactionBody,
        username: req.body.username,
      };
      const thought = await Thought.findByIdAndUpdate({ _id: req.params.thoughtId }, { $addToSet: { reactions: reaction } }, { new: true });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json({ thought, message: 'Reaction created!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.body.reactionId } } },
        { new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json({ thought, message: 'Reaction deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  }
};