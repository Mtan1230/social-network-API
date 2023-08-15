const router = require('express').Router();
const { getThoughts, createThought, getSingleThought, updateThought, deleteThought } = require('../../controllers/thoughtController');

// /api/thoughts
// TODO: `POST` to create a new thought (don't forget to push the created thought's `_id` to the associated user's `thoughts` array field)
router.route('/').get(getThoughts).post(createThought);

// /api/thoughts/:thoughtId
router
  .route('/:thoughtId')
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
// TODO: `POST` to create a reaction stored in a single thought's `reactions` array field
// TODO: `DELETE` to pull and remove a reaction by the reaction's `reactionId` value

module.exports = router;
