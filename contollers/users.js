// controllers/users.js
// файл контроллеров
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { statusCode } = require('../constants/constants');
const {
  ConflictError,
  BadRequestError,
  InternalServerError,
  NotFoundError,
} = require('../errors');

const User = require('../models/User');

module.exports.createUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash,
      name,
    });
    return res.status(statusCode.Created).send({
      data: {
        email: user.email,
        name: user.name,
        about: user.about,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
    } if (err.name === 'ValidationError') {
      return next(new BadRequestError());
    }
    return next(new InternalServerError());
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret', { expiresIn: '7d' });
    return res.status(statusCode.OK).send({ token });
  } catch (err) {
    return next(err);
  }
};

module.exports.getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return next(new NotFoundError());
    }
    return res.status(statusCode.OK).send({ data: user });
  } catch (err) {
    return next(new InternalServerError());
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const userID = req.user._id;
    const { email, name } = req.body;
    const user = await User.findByIdAndUpdate(
      userID,
      { email, name },
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(new NotFoundError());
    }
    return res.status(statusCode.OK).send({ data: user });
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
    } if (err.name === 'ValidationError') {
      return next(new BadRequestError());
    }
    return next(new InternalServerError());
  }
};
