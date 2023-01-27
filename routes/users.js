const usersRoutes = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const {
  updateProfile,
  getUserInfo,
} = require('../contollers/users');

usersRoutes.get('/me', getUserInfo);

usersRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required(),
  }),
}), updateProfile);

module.exports = usersRoutes;
