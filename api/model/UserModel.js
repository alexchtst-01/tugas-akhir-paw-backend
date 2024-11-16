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
        citycountry: {
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