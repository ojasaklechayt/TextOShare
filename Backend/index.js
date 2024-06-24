const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const { writeUserData, getDataFromDatabase, getAllData, updateData } = require("./database-functions");

const app = express();
const port = 3000;

app.use(morgan('combined'));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/notes/:notesID", (req, res) => {
    const { notesID } = req.params;
    const { note } = req.body;
    const time = new Date().toISOString();
    writeUserData(notesID, note, time);
    res.send(`User data for user ${notesID} written to the database successfully`);
});

app.put("/notes/:notesID", (req, res) => {
    const { notesID } = req.params;
    const { note } = req.body;
    const time = new Date().toISOString();
    const updatedFields = { note, time };
    updateData(notesID, updatedFields);
    res.send(`User data for user ${notesID} updated successfully`);
});


app.get("/notes/:notesID", (req, res) => {
    const { notesID } = req.params;
    getDataFromDatabase(notesID, (data) => {
        res.send(`Your notes are ${notesID}: ${data.note}`);
    });
});

app.get("/notes", (req, res) => {
    getAllData((data) => {
        if (!data) {
            return res.status(404).send('No notes found');
        }
        res.send(data);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
