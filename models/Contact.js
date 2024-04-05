const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;