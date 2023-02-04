const usersRoutes = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const {
  updateProfile,
  getUserInfo,
} = require('../contollers/users');

const validationUser = {
  name: Joi.string().min(2).max(30),
  email: Joi.string(),
};
usersRoutes.get('/me', getUserInfo);

usersRoutes.patch('/me', celebrate({
  body: Joi.object().keys(validationUser),
}), updateProfile);

module.exports = usersRoutes;
