const User = require('../models/user');
const Post = require('../models/post');
const { generateToken, verifyToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs');

module.exports = {
    Query: {
        users: () => User.find(),
        user: (_, { id }) => User.findById(id),
        posts: () => Post.find(),
        post: (_, { id }) => Post.findById(id),
    },

    Mutation: {
        login: async (_, { credentials }) => {
            const user = await User.findOne({ email: credentials.email });
            if (!user) throw new Error('User not found');

            const valid = await bcrypt.compare(credentials.password, user.password);
            if (!valid) throw new Error('Invalid password');

            const token = generateToken(user);
            return { token, user };
        },

        // Register user with password
        addUser: async (_, { user }) => {
            const newUser = new User(user);
            return await newUser.save();
        },

        // Protected route: user must be authenticated
        addPost: async (_, { post }, { user }) => {
            if (!user) throw new Error('Unauthorized');
            const newPost = new Post(post);
            return await newPost.save();
        }
    },

    User: {
        posts: (parent) => Post.find({ authorId: parent.id }),
    },

    Post: {
        author: (parent) => User.findById(parent.authorId),
    },
};
