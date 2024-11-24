import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        subject: {
            type: String,
            required: true,
            default: 'lain-lain'
        },
        merchant: {
            type: String,
            required: true,
            default: 'lain-lain'
        },
        date: {
            type: String,
            required: true,
            default: '-'
        },
        total: {
            type: Number,
            required: true,
            default: 0
        },
        reimbuse: {
            type: Boolean,
            required: true,
            default: false
        },
        category: {
            type: String,
            required: true,
            default: 'lain-lain',
            enum: ["food", "entertainment", "health", "groceries", "transportation", "electricity", "lain-lain"]
        },
        description: {
            type: String,
            required: true,
            default: '-'
        },
        payment_method: {
            type: String,
            required: true,
            default: 'lain-lain',
            enum: ["Debit Card", "Virtual Account", "QRIS", "Cash", "m-banking", "lain-lain"]
        },
        invoice: {
            type: String,
            required: true,
            default: '...'
        },
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user_table"
        }
    },
    {
        timestamps: true
    }
)

const Expanse = mongoose.model('expense_table', expenseSchema);
export default Expanse;