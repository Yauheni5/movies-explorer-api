const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { cors } = require('./middlewares/cors');
const router = require('./routes/index');
const errorsHandler = require('./middlewares/errors');
const limiter = require('./middlewares/limiter');

const { PORT = 3000, DB = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const app = express();

app.use(cors);
mongoose.connect(DB);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(requestLogger); // подключаем логгер запросов
app.use(limiter);
app.use(router);
app.use(helmet());
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());

app.use(errorsHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
