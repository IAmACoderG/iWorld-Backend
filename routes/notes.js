const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');
var fetchuser = require('../middleware/fetchuser');

//Route 1:Get All the Notes User using Get "/api/notes/fetchallnotes.login Required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const note = await Notes.find({ user: req.user });
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//Route 2:Get the User Notes Data using post "/api/notes/getdata.login Required
router.post('/getdata', fetchuser, [
    body('title', 'Enter The Valid title').isLength({ min: 3 }),
    body('discription', 'discription must be Atleast minimum length of 5').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, discription } = req.body;

        //if there are error ,return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const notee = new Notes({
            title, discription, user: req.user,
        });
        const savednote = await notee.save();
        res.json({ note: savednote, userEnterExist: req.user });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//Route 3:Upating Existing User Notes Data using put "/api/notes/updatenote.login Required
router.put('/updatenote/:id', fetchuser, async (req, res) => {

    //Id must be maximum 24 hexa for that reason trimed id
    const paramId = req.params.id;
    if (paramId.length === 25) {
        req.params.id = paramId.substring(1, 25);
    }
    try {
        const { title, discription } = req.body;
        //Create a newNote Objects

        const newNote = {};
        if (title) { newNote.title = title };
        if (discription) { newNote.discription = discription };

        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") };

        if (note.user.toString() !== req.user) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


//Route 3:Deleled Existing User Notes Data using put "/api/notes/deletenote.login Required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    //Id must be maximum 24 hexa for that reason trimed id
    const paramId = req.params.id;
    if (paramId.length === 25) {
        req.params.id = paramId.substring(1, 25);
    }
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Note Not Found") };

        if (note.user.toString() !== req.user) {
            return res.status(401).send("Not Allowed Deletion:- ", note.user.toString(), req.user._id);

        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json("Deleted Notes 'Successfully'");


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router
