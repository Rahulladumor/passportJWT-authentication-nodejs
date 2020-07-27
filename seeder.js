const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('color');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// load models
const User = require('./models/User');
const Task = require('./models/Task');

// Connect to DB
new mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON files
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/user.json`, 'utf-8')
);

// Read JSON files
const tasks = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/task.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await User.create(users);
    await Task.create(tasks);
    console.log('Data Imported');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete into DB
const deleteData = async () => {
  try {
    await User.deleteMany(users);
    await Task.deleteMany(tasks);
    console.log('Data Deleted');
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
