const errorsHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = (err.statusCode === 500) ? 'Произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next(err);
};

module.exports = errorsHandler;
