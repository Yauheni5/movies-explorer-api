const moviesRoutes = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const { urlRegex } = require('../constants/constants');
const {
  createMovie,
  deleteMovie,
  getMovies,
} = require('../contollers/movies');

const validationMovies = {
  country: Joi.string().min(2).max(30).required(),
  director: Joi.string().min(2).max(30).required(),
  duration: Joi.number().min(1).max(30).required(),
  year: Joi.string().min(2).max(10).required(),
  description: Joi.number().min(2).max(100).required(),
  image: Joi.string().required().pattern(urlRegex),
  trailerLink: Joi.string().required().pattern(urlRegex),
  thumbnail: Joi.string().required().pattern(urlRegex),
  movieId: Joi.number().min(1).max(30).required(),
  nameRU: Joi.string().min(1).max(50).required(),
  nameEN: Joi.string().min(1).max(50).required(),
  link: Joi.string().required().pattern(urlRegex),
};

moviesRoutes.get('/', getMovies);

moviesRoutes.post('/', celebrate({
  body: Joi.object().keys(validationMovies),
}), createMovie);

moviesRoutes.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
}), deleteMovie);

module.exports = moviesRoutes;
