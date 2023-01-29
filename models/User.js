const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { default: isEmail } = require('validator/lib/isEmail');
const { AuthError, InternalServerError } = require('../errors');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String, // имя — это строка
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    required: true,
  },
});

userSchema.statics.findUserByCredentials = async function findUserByCredentials(email, password) {
  try {
    const user = await this.findOne({ email }).select('+password');
    if (!user) {
      return Promise.reject(new AuthError('Неправильные почта или пароль'));
    }
    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return Promise.reject(new AuthError('Неправильные почта или пароль'));
    }
    return user;
  } catch (err) {
    return Promise.reject(new InternalServerError());
  }
};
module.exports = mongoose.model('User', userSchema);
