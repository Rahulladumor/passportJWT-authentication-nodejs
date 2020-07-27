const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc       login user
// @route      POST /api/v1/auth/login
// @access     Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate Email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please enter email & password', 400));
  }

  // Check for User
  const user = await User.findOne({ email }).select('+password');
  const token = await user.genUserToken();

  if (!user) {
    return next(new ErrorResponse('Invalid Credential', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid Credential', 401));
  }

  res.send({ user, token });
});

exports.logout = async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send('Successfully logout');
  } catch (e) {
    res.status(500).send();
  }
};

exports.logoutAll = async (req, res, next) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send('Successfully logoutAll');
  } catch (e) {
    res.status(500).send();
  }
};
