const express = require("express");
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { writeUserData, getDataFromDatabase, getAllData, updateData, DatabaseError } = require("./database-functions");
const { ValidationError } = require('./validators');

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(compression());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT'],
}));
app.use(express.json({ limit: '1mb' }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

const errorHandler = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message });
    }
    if (err instanceof DatabaseError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal server error' });
};

app.post("/notes/:notesID", async (req, res, next) => {
    try {
        const { notesID } = req.params;
        const { note } = req.body;
        await writeUserData(notesID, note, new Date().toISOString());
        res.status(201).json({ message: `Note ${notesID} created successfully` });
    } catch (error) {
        next(error);
    }
});

app.put("/notes/:notesID", async (req, res, next) => {
    try {
        const { notesID } = req.params;
        const { note } = req.body;
        await updateData(notesID, note, new Date().toISOString());
        res.status(200).json({ message: `Note ${notesID} updated successfully` });
    } catch (error) {
        next(error);
    }
});

app.get("/notes/:notesID", async (req, res, next) => {
    try {
        const { notesID } = req.params;
        const data = await getDataFromDatabase(notesID);
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
});

app.get("/notes", async (req, res, next) => {
    try {
        const data = await getAllData();
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

app.listen(port);
