import mongoose from "mongoose";

const blogs = new mongoose.Schema({
    title: { 
        type: String, 
        required: true
    },
    content: { 
        type: String, 
        required: true 
    },
    author: { 
        type: String, 
        required: true 
    },
    authorName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
});

export default mongoose.model('blogs', blogs);