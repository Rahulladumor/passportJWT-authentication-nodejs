const User = require('../models/User');
const Task = require('../models/Task');

const asyncHandler = require('../middleware/async');

exports.createTask = asyncHandler(async (req, res, next) => {
  // req.body.user = req.params.userId;

  // const user = await User.findById(req.params.userId);
  // const task = await Task.create(req.body);

  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.send(e);
  }
  res.status(200).json({
    success: true,
    data: task,
  });
});

// @desc Get task
// @Route GET /api/task

exports.getTask = asyncHandler(async (req, res, next) => {
  // let query;

  // if (req.params.userId) {
  //   query = Task.find({ user: req.params.userId });
  // } else {
  //   query = Task.find();
  // }

  try {
    await req.user.populate('tasks').execPopulate();
    //res.send(req.user.tasks);
    //const tasks = await Task.find();
    // res
    //   .status(200)
    //   .json({ success: true, count: tasks.length, data: req.user.tasks });
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
});

exports.getSingleTask = async (req, res, next) => {
  const _id = req.params.id;
  try {
    //before authentication find single user
    //const task = await Task.findById(req.params.id);
    // after relationship & authentication
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return next(
        new ErrorResponse(`Task is not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(
      new ErrorResponse(`Task is not found with id of ${req.params.id}`, 404)
    );
  }
};

exports.updateTask = async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ['isCompleted', 'title', 'dueDate'];
  const isValidOperation = updates.every((update) =>
    allowUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Operator' });
  }

  try {
    //const task = await Task.findById(req.params.id);
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(400).send();
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};

exports.deleteTask = async (req, res, next) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!task) {
    res.status(404).send();
  }

  res
    .status(200)
    .json({
      success: true,
      data: [],
    })
    .send(task);
};
