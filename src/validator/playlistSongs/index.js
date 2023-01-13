const InvariantError = require('../../exceptions/InvariantError');
const { SongIdPayloadSchema } = require('./schema');

const PlaylistSongsValidator = {
  validateSongIdPayload: (payload) => {
    const validationResult = SongIdPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistSongsValidator;
