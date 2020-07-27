const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');
require('../config/passport');
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    //console.log(token);
    const decoded = jwt.verify(token, 'secret');
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};
passport.authenticate('jwt', { session: false });

module.exports = auth;
