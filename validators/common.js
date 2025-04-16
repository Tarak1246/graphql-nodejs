const Joi = require('joi');

exports.validateObjectId = (id) => {
  const schema = Joi.string().regex(/^[0-9a-fA-F]{24}$/).required();
  return schema.validate(id);
};
