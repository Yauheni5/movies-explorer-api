const moviesRoutes = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const { urlRegex } = require('../constants/constants');
const {
  createMovie,
  deleteMovie,
  getMovies,
} = require('../contollers/movies');

const validationMovies = {
  country: Joi.string().required(),
  director: Joi.string().required(),
  duration: Joi.number().required(),
  year: Joi.string().required(),
  description: Joi.number().required(),
  image: Joi.string().required().pattern(urlRegex),
  trailerLink: Joi.string().required().pattern(urlRegex),
  thumbnail: Joi.string().required().pattern(urlRegex),
  movieId: Joi.number().required(),
  nameRU: Joi.string.required(),
  nameEN: Joi.string().required(),
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
