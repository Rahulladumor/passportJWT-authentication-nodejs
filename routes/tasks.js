const express = require('express');
const auth = require('../middleware/auth');
const {
  createTask,
  getTask,
  getSingleTask,
  updateTask,
  deleteTask,
} = require('../controller/tasks');

const router = express.Router({ mergeParams: true });

router.post('/', auth, createTask);
router.get('/', auth, getTask);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

router.get('/:id', auth, getSingleTask);

module.exports = router;
