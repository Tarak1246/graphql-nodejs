const { AuthenticationError } = require('apollo-server');

const requireAuth = (resolverFunc) => {
  return (parent, args, context, info) => {
    if (!context.user) {
      throw new AuthenticationError('You must be logged in');
    }
    return resolverFunc(parent, args, context, info);
  };
};

module.exports = { requireAuth };
