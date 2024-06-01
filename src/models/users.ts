import mongoose from "mongoose";

const users = new mongoose.Schema({
    name: { 
        type: String, 
        required: true
    },
    email: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

export default mongoose.model('users', users)