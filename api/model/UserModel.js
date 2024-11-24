import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: Number,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        // field buat profile set up
        firstname: {
            type: String,
            required: true,
            default: '-'
        },
        lastname: {
            type: String,
            required: true,
            default: '-'
        },
        address: {
            type: String,
            required: true,
            default: '-'
        },
        country: {
            type: String,
            required: true,
            default: '-'
        },
        nationality: {
            type: String,
            required: true,
            default: '-'
        },
        occupation: {
            type: String,
            required: true,
            default: '-'
        },
    },
    {
        timeStamps: true
    }
);

const User = mongoose.model("user_table", userSchema);
export default User;