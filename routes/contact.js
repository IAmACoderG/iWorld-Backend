const express = require('express');
const router = express.Router();
const Contact = require("../models/Contact")
const { validationResult } = require('express-validator');

router.post("/individual", async (req, res) => {
    try {
        const { fullName, email, number } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(402).json({ Error: errors.array() })
        }

        // const contact = new Contact({ fullName, email, number });
        // const contactDetails = await contact.save();
        const contactDetails = await Contact.create({ fullName, email, number });
        if (!contactDetails) return res.status(404).json("Error Occurs while Created Contact")
        return res.status(202).json({ contactDetails })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Contact Backend Error");
    }
})

module.exports = router