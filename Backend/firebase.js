const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");
require('dotenv').config();

const DatabaseURL = process.env.REACT_APP_FIREBASE_DATABASE_URL

const firebaseConfig = {
    databaseURL: DatabaseURL
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

module.exports = { app, database };