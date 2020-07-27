const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  createUser,
  getUser,
  deleteUser,
  updateUser,
  getSingleUser,
  getMe,
} = require('../controller/users');

// Include other resource routers
const taskRouter = require('./tasks');

// re-route into other resource routers
router.use('/:userId/tasks', taskRouter);

router.get('/me', auth, getMe);
router.delete('/me', auth, deleteUser);
router.put('/me', auth, updateUser);
router.get('/:id', getSingleUser);
router.route('/').post(createUser).get(getUser);

module.exports = router;
