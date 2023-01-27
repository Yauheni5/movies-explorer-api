const Movie = require('../models/Movie');
const { statusCode } = require('../constants/constants');
const {
  InternalServerError,
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} = require('../errors');

module.exports.createCard = async (req, res, next) => {
  try {
    const cardOwnerId = req.user._id;
    const { name, link } = req.body;
    const card = await Movie.create({ name, link, owner: cardOwnerId });
    if (!card) {
      return next(new NotFoundError());
    }
    return res.status(statusCode.OK).send({ data: card });
  } catch (err) {
    return next(new InternalServerError({ message: 'На сервере произошла ошибка' }));
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    return await Movie.findByIdAndRemove(req.params._id)
      .then((cardDeleting) => {
        if (!cardDeleting) {
          return next(new NotFoundError());
        }
        if (cardDeleting.owner.toString() === userId) {
          return res.status(statusCode.OK).send({ message: `Карточка ${cardDeleting.name} удалена` });
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

module.exports.getCards = async (req, res, next) => {
  try {
    const card = await Movie.find({}).populate(['owner', 'likes']);
    return res.status(statusCode.OK).send({ data: card });
  } catch (err) {
    return next(new InternalServerError());
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Movie.findByIdAndUpdate(
      req.params._id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);
    if (!card) {
      return next(new NotFoundError());
    }
    return res.status(statusCode.OK).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError());
    }
    return next(new InternalServerError());
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Movie.findByIdAndUpdate(
      req.params._id,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    ).populate(['owner', 'likes']);
    if (!card) {
      return next(new NotFoundError());
    }
    return res.status(statusCode.OK).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError());
    }
    return next(new InternalServerError());
  }
};
