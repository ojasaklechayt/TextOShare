const { app, database, analytics }  = require('./firebase');
const { ref, set, onValue } = require("firebase/database");
function writeUserData(notesID, note) {
    set(ref(database, `notes/${notesID}`), {
        notesID: notesID,
        note: note
    });
}


function getDataFromDatabase(notesID, updateStarCount) {
    const starCountRef = ref(database, `notes/${notesID}`);
    onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        updateStarCount(data);
    });
}

module.exports = { writeUserData, getDataFromDatabase };