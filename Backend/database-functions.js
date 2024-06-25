const { ref, set, onValue, update } = require("firebase/database");
const { database } = require('./firebase');

function writeUserData(notesID, note, time) {
    set(ref(database, `notes/${notesID}`), {
        notesID: notesID,
        note: note,
        time: time
    }).catch(error => {
        console.error("Error writing data:", error);
    });
}

function getDataFromDatabase(notesID, updateStarCount) {
    const starCountRef = ref(database, `notes/${notesID}`);
    onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        updateStarCount(data);
    }, error => {
        console.error("Error reading data:", error);
    });
}

function getAllData(updateStarCount) {
    const starCountRef = ref(database, '/notes');
    onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        updateStarCount(data);
    }, error => {
        console.error("Error reading data:", error);
    });
}

async function updateData(notesID, note, time) {
    const db = database;
    const updates = {};
    updates[`/notes/${notesID}/note`] = note;
    updates[`/notes/${notesID}/time`] = time;

    try {
        await update(ref(db), updates);
        console.log(`Data updated successfully for notesID: ${notesID}`);
    } catch (error) {
        console.error("Error updating data:", error);
    }
}

module.exports = { writeUserData, getDataFromDatabase, getAllData, updateData };
