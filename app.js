const express = require('express');
const mongoose = require('mongoose');
const { errors, Joi, celebrate } = require('celebrate');
const usersRoutes = require('./routes/users');
const moviesRoutes = require('./routes/movies');
const { login, createUser } = require('./contollers/users');
const auth = require('./middlewares/auth');
const { NotFoundError } = require('./errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { cors } = require('./middlewares/cors');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cors);
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(requestLogger); // подключаем логгер запросов

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use('/users', auth, usersRoutes);
app.use('/movies', auth, moviesRoutes);

app.all('/*', (req, res, next) => next(new NotFoundError('Данной страницы не существует!')));

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = (err.statusCode === 500) ? 'Произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next(err);
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
