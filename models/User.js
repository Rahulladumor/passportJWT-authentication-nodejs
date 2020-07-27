const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./Task');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please Enter Email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid Email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please Enter Password'],
    minlength: 6,
    select: false,
  },
  firstname: {
    type: String,
    required: [true, 'Please Enter your First Name'],
    trim: true,
  },
  lastname: {
    type: String,
    required: [true, 'Please Enter Last Name'],
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
});

// For public Profile data (hidden Data)
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

// Cascade delete
UserSchema.pre('remove', async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

// Hash plain text password before saving
UserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//generate user token
UserSchema.methods.genUserToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'secret', {
    expiresIn: 40,
  });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
module.exports = mongoose.model('User', UserSchema);
