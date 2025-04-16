const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcryptjs');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { requireAuth } = require('../middlewares/auth');

module.exports = {
    Query: {
        users: () => User.find(),
        posts: () => Post.find(),
        user: async (_, { id }) => User.findById(id),
        post: async (_, { id }) => Post.findById(id),
    },

    Mutation: {
        addUser: async (_, { user }) => {
            const newUser = new User(user);
            return await newUser.save();
        },

        login: async (_, { credentials }) => {
            const user = await User.findOne({ email: credentials.email });
            if (!user) throw new Error('User not found');

            const pepper = process.env.PEPPER || '';
            const valid = await bcrypt.compare(credentials.password + pepper, user.password);
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
            const newPost = new Post(post);
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
