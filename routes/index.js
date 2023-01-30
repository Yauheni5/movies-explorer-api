const router = require('express').Router();

const { Joi, celebrate } = require('celebrate');
const usersRoutes = require('./users');
const moviesRoutes = require('./movies');
const { login, createUser } = require('../contollers/users');
const auth = require('../middlewares/auth');
const { NotFoundError } = require('../errors');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

router.use('/users', auth, usersRoutes);
router.use('/movies', auth, moviesRoutes);

router.all('/*', (req, res, next) => next(new NotFoundError('Данной страницы не существует!')));

module.exports = router;
