import mongoose from "mongoose";

const moneySchema = new mongoose.Schema(
    {
        balance: {
            type: Number,
            required: true,
            default: 0
        },
        total_income: {
            type: Number,
            required: true,
            default: 0
        },
        total_expanse: {
            type: Number,
            required: true,
            default: 0
        },
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user_table",
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Money = mongoose.model("money_table", moneySchema);
export default Money;