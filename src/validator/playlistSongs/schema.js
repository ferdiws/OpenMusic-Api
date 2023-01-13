const Joi = require('joi');

const SongIdPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { SongIdPayloadSchema };
