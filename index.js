const connectToMongo = require('./db');
const express = require('express');
var cors = require("cors");
require('dotenv').config()

connectToMongo();

const app = express();
const port = process.env.PORT || 4000

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    Credential: true
}))

//Available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/contact', require('./routes/contact'));


app.listen(port, () => {
    console.log(`iNoteBook Backend listening on port http://localhost:${port}`)
});