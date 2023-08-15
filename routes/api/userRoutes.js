const router = require('express').Router();
const { getUsers, createUser, getSingleUser, updateUser, deleteUser } = require('../../controllers/userController');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
// TODO: `GET` a single user by its `_id` and populated thought and friend data
// TODO: **BONUS**: Remove a user's associated thoughts when deleted.
router
  .route('/:userId')
  .get(getSingleUser)
  .put(updateUser)
  .delete(deleteUser);

// /api/users/:userId/friends/:friendId
// TODO: `POST` to add a new friend to a user's friend list
// TODO: `DELETE` to remove a friend from a user's friend list

module.exports = router;
