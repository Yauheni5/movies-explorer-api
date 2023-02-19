const Movie = require('../models/Movie');
const { statusCode } = require('../constants/constants');
const {
  InternalServerError,
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} = require('../errors');

module.exports.createMovie = async (req, res, next) => {
  try {
    const cardOwnerId = req.user._id;
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    } = req.body;
    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: cardOwnerId,
    });
    if (!movie) {
      return next(new NotFoundError());
    }
    return res.status(statusCode.OK).send({ data: movie });
  } catch (err) {
    return next(new InternalServerError({ message: 'На сервере произошла ошибка' }));
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const userId = req.user._id;
    return await Movie.findByIdAndRemove(req.params._id)
      .then((movieDeleting) => {
        if (!movieDeleting) {
          return next(new NotFoundError());
        }
        if (movieDeleting.owner.toString() === userId) {
          return res.status(statusCode.OK).send({ message: `Фильм ${movieDeleting.name} удален` });
        }
        return next(new ForbiddenError());
      });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError());
    }
    return next(new InternalServerError());
  }
};

module.exports.getMovies = async (req, res, next) => {
  try {
    const movie = await Movie.find({}).populate(['owner']);
    return res.status(statusCode.OK).send({ data: movie });
  } catch (err) {
    return next(new InternalServerError());
  }
};
