const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcryptjs');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { requireAuth } = require('../middlewares/auth');
const { validateUserInput, validateLoginInput } = require('../validators/user');
const { validatePostInput } = require('../validators/post');
const { validateObjectId } = require('../validators/common');

module.exports = {
    Query: {
        users: requireAuth(() => User.find()),
        posts: requireAuth(() => Post.find()),
        user: requireAuth(async (_, { id }) => {
            const { error } = validateObjectId(id);
            if (error) throw new Error(`Invalid ID: ${error.details[0].message}`);
            return await User.findById(id);
        }),
        post: requireAuth(async (_, { id }) => {
            const { error } = validateObjectId(id);
            if (error) throw new Error(`Invalid ID: ${error.details[0].message}`);
            return await Post.findById(id);
        }),
    },

    Mutation: {
        addUser: async (_, { user }) => {
            const { error, value } = validateUserInput(user);
            if (error) throw new Error(`Invalid input: ${error.details[0].message}`);

            const newUser = new User(value); // use sanitized value
            return await newUser.save();
        },

        login: async (_, { credentials }) => {
            const { error, value } = validateLoginInput(credentials);
            if (error) throw new Error(`Invalid login: ${error.details[0].message}`);

            const user = await User.findOne({ email: value.email });
            if (!user) throw new Error('User not found');

            const pepper = process.env.PEPPER || '';
            const valid = await bcrypt.compare(value.password + pepper, user.password);
            if (!valid) throw new Error('Invalid password');

            const token = generateToken(user);
            const refreshToken = generateRefreshToken(user);

            return { token, refreshToken, user };
        },

        refreshToken: async (_, { token }) => {
            const decoded = verifyRefreshToken(token);
            const user = await User.findById(decoded.id);
            if (!user) throw new Error('User not found');

            return {
                token: generateToken(user),
                refreshToken: generateRefreshToken(user),
                user
            };
        },

        addPost: requireAuth(async (_, { post }, context) => {
            const { error, value } = validatePostInput(post);
            if (error) throw new Error(`Invalid post input: ${error.details[0].message}`);

            const newPost = new Post(value);
            return await newPost.save();
        }),
    },

    User: {
        posts: (parent) => Post.find({ authorId: parent.id }),
    },
    Post: {
        author: (parent) => User.findById(parent.authorId),
    }
};
