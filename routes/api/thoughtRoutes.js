const router = require('express').Router();
const { getThoughts, createThought, getSingleThought, updateThought, deleteThought, createReaction, deleteReaction } = require('../../controllers/thoughtController');

// /api/thoughts
router.route('/').get(getThoughts).post(createThought);

// /api/thoughts/:thoughtId
router
  .route('/:thoughtId')
  .get(getSingleThought)
  .put(updateThought)
  .delete(deleteThought);

// /api/thoughts/:thoughtId/reactions
router
  .route('/thoughts/:thoughtId/reactions')
  .post(createReaction)
  .delete(deleteReaction);

module.exports = router;
