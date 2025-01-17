const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    media: {
        type: [{
            url: String,
            type: {
                type: String,
                enum: ['image', 'video', 'audio', 'other'],
                required: true
            }
        }],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const TrendingSchema = new mongoose.Schema({
    hashtag: {
        type: String,
        required: true,
        unique: true
    },
    count: {
        type: Number,
        default: 1
    },
    views: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});


const Post = mongoose.model('Post', PostSchema);
const Trending = mongoose.model('Trending', TrendingSchema);

module.exports = { Post, Trending };