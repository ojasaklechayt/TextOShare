const { ref, set, onValue, update } = require("firebase/database");
const { database } = require('./firebase');
const { validateNote, validateNotesID } = require('./validators');

class DatabaseError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = 'DatabaseError';
        this.statusCode = statusCode;
    }
}

async function writeUserData(notesID, note, time) {
    try {
        validateNotesID(notesID);
        validateNote(note);

        await set(ref(database, `notes/${notesID}`), {
            notesID,
            note,
            time,
            lastUpdated: Date.now()
        });
        return { success: true };
    } catch (error) {
        throw new DatabaseError(error.message, 500);
    }
}

function getDataFromDatabase(notesID) {
    return new Promise((resolve, reject) => {
        validateNotesID(notesID);
        
        const noteRef = ref(database, `notes/${notesID}`);
        onValue(noteRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                reject(new DatabaseError('Note not found', 404));
            } else {
                resolve(data);
            }
        }, error => {
            reject(new DatabaseError(error.message, 500));
        });
    });
}

function getAllData() {
    return new Promise((resolve, reject) => {
        const notesRef = ref(database, '/notes');
        onValue(notesRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                reject(new DatabaseError('No notes found', 404));
            } else {
                resolve(data);
            }
        }, error => {
            reject(new DatabaseError(error.message, 500));
        });
    });
}

async function updateData(notesID, note, time) {
    try {
        validateNotesID(notesID);
        validateNote(note);

        const updates = {
            [`/notes/${notesID}/note`]: note,
            [`/notes/${notesID}/time`]: time,
            [`/notes/${notesID}/lastUpdated`]: Date.now()
        };

        await update(ref(database), updates);
        return { success: true };
    } catch (error) {
        throw new DatabaseError(error.message, 500);
    }
}

module.exports = {
    writeUserData,
    getDataFromDatabase,
    getAllData,
    updateData,
    DatabaseError
};