class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

function validateNotesID(notesID) {
    if (!notesID || typeof notesID !== 'string' || notesID.length < 3) {
        throw new ValidationError('Invalid notesID: Must be a string with at least 3 characters');
    }
}

function validateNote(note) {
    if (!note || typeof note !== 'string') {
        throw new ValidationError('Invalid note: Must be a non-empty string');
    }
    if (note.length > 10000) {
        throw new ValidationError('Note exceeds maximum length of 10000 characters');
    }
}

module.exports = {
    validateNote,
    validateNotesID,
    ValidationError
};