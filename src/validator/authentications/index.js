const { AuthPayloadSchema, EditAuthPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationsValidator = {
  validateAuthPayload: (payload) => {
    const validationResult = AuthPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateEditAuthPayload: (payload) => {
    const validationResult = EditAuthPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
