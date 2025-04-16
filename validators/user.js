const Joi = require('joi');

exports.validateUserInput = (input) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(6).trim().required()
  });

  return schema.validate(input);
};

exports.validateLoginInput = (input) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().required()
  });

  return schema.validate(input);
};
