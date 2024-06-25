const express = require("express");
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const { writeUserData, getDataFromDatabase, getAllData, updateData } = require("./database-functions");

const app = express();
const port = 3000;

app.use(compression());
app.use(cors());
app.use(bodyParser.json());

app.post("/notes/:notesID", async (req, res) => {
    const { notesID, note } = req.body;
    const time = new Date().toISOString();
    try {
        await writeUserData(notesID, note, time);
        res.status(200).send(`User data for user ${notesID} written to the database successfully`);
    } catch (error) {
        res.status(500).send("Error writing data to the database");
    }
});

app.put("/notes/:notesID", async (req, res) => {
    const { notesID, note } = req.body;
    const time = new Date().toISOString();
    const updatedFields = { note, time };
    try {
        await updateData(notesID, updatedFields);
        res.status(200).send(`User data for user ${notesID} updated successfully`);
    } catch (error) {
        res.status(500).send("Error updating data in the database");
    }
});

app.get("/notes/:notesID", (req, res) => {
    const notesID = req.params.notesID;
    getDataFromDatabase(notesID, (data) => {
        if (!data) {
            return res.status(404).send(`No data found for user ${notesID}`);
        }
        res.status(200).send(data);
    });
});

app.get("/notes", (req, res) => {
    getAllData((data) => {
        if (!data) {
            return res.status(404).send('No notes found');
        }
        res.status(200).send(data);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
