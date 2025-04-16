const Joi = require('joi');

exports.validatePostInput = (input) => {
  const schema = Joi.object({
    title: Joi.string().min(3).trim().required(),
    content: Joi.string().min(10).trim().required(),
    authorId: Joi.string().required()
  });

  return schema.validate(input);
};
