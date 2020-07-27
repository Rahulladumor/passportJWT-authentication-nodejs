const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

exports.createUser = async (req, res, next) => {
  //console.log(req.body);
  // const user = await User.create(req.body);
  const user = await User(req.body);

  try {
    await user.save();
    const token = await user.genUserToken();
    res.status(201).send({ user, token }).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.send(err);
  }
};

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    success: true,
    count: user.length,
    data: user,
  });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

exports.getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(`User is not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(
      new ErrorResponse(`User is not found with id of ${req.params.id}`, 404)
    );
  }
};

exports.updateUser = async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ['email', 'firstname', 'lastname', 'password'];
  const isValidOperation = updates.every((update) =>
    allowUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Operator' });
  }
  try {
    // const user = await User.findById(req.user._id);

    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};

exports.deleteUser = async (req, res, next) => {
  // const user = await User.findByIdAndDelete(req.user._id);
  // res.status(200).json({
  //   success: true,
  //   data: [],
  // });
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
};

// exports.login = async (req, res, next) => {
//   try {
//     const user = await User.findByCredentials(
//       req.body.email,
//       req.body.password
//     );
//     res.status(200).json({
//       data: user,
//       success: true,
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       error: 'wrong credentials',
//     });
//   }
// };
