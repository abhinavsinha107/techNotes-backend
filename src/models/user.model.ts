import mongoose from "mongoose";
import {IUser} from "../../types"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        default: "Employee"
    }],
    active: {
        type: Boolean,
        default: true
    }
})

const User = mongoose.model<IUser>("user", userSchema);

export default User;