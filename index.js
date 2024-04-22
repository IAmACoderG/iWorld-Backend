require('dotenv').config();
const connectToMongo = require('./db');
const express = require('express');
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");
const passportStrategy = require("./passport");

connectToMongo();

const app = express();
const port = process.env.PORT || 4000

app.use(
    cookieSession({
        name: "session",
        keys: ["cyberwolve"],
        maxAge: 24 * 60 * 60 * 100,
    })
);

app.use(passport.initialize());
app.use(passport.session());


app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cors({
    origin: "https://i-world-connected.vercel.app" || "*",
    methods: "GET,POST,PUT,DELETE",
    Credential: true
}))

//Available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/contact', require('./routes/contact'));
app.use("/socialAuth", require('./routes/socialAuth'));


app.listen(port, () => {
    console.log(`iNoteBook Backend listening on port http://localhost:${port}`)
});