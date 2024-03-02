const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const { writeUserData, getDataFromDatabase } = require("./database-functions");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post("/notes/:notesID", (req, res) => {
    const { notesID } = req.params;
    const { note } = req.body;
    writeUserData(notesID, note);
    res.send(`User data for user ${notesID} written to the database successfully`);
});

app.get("/notes/:notesID", (req, res) => {
    const { notesID } = req.params;
    getDataFromDatabase(notesID, (data) => {
        res.send(`Your notes are ${notesID}: ${data.note}`);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
