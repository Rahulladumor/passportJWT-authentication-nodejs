const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const color = require('color');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const errorhandler = require('./middleware/error');
const logger = require('./middleware/logger');
const User = require('./models/User');
const connectDB = require('./config/db');

// Route Files
const users = require('./routes/users');
const tasks = require('./routes/tasks');
const auth = require('./routes/auth');

//load env variables
dotenv.config({ path: './config/config.env' });

// Connection to Databse
connectDB();

const app = express();
const port = 3000;

// app.use((req, res, next) => {
//   res.status(503).send('Our site is on maitainance');
// });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(bodyParser.raw());

app.use(logger);

// Mount Routes
app.use('/api/users', users);
app.use('/api/tasks', tasks);
app.use('/api/auth', auth);

require('./config/passport');
app.use(passport.initialize());
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

// Handle unHandle rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
