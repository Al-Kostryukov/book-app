const dbConnection = require('./db');

const bookModel = {
    add: function() {

    },
    find: async function() {
        await dbConnection.query('SELECT * FROM books');
    },
    modify: function() {

    }
};

module.exports = bookModel;