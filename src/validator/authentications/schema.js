const Joi = require('joi');

const AuthPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const EditAuthPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = { AuthPayloadSchema, EditAuthPayloadSchema };
