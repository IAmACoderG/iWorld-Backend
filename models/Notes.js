const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        require: true
    },
    discription: {
        type: String,
        require: true,
    },
}, { timestamps: true });

const Note = mongoose.model('Note', NotesSchema);
module.exports = Note;