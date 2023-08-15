const { User, Thought } = require('../models');

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
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

      const thought = new Thought({
        thoughtText: req.body.thoughtText,
        username: user.username,
      });
      await thought.save();
      await user.thoughts.push(thought._id).save();
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

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
      const thought = await Thought.find({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      const user = await User.findOne({ username: req.body.username });

      if (!user) {
        return res.status(404).json({ message: 'No user with that username' });
      }

      const reaction = {
        reactionBody: req.body.reactionBody,
        username: req.body.username,
      };

      await thought.reactions.push(reaction).save();
      res.json({ reaction: thought.reactions.at(-2), message: 'Reaction created!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: req.body.reactionId } },
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