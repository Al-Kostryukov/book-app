const dbConnection = require('./db');


const bookModel = {
    add: async function(params, imageDestination) {
        // little callback hell, sorry) promisify later
        const authorSelectResult = await dbConnection.query('SELECT author_id FROM Authors WHERE name = "' + dbConnection.escape(params.author)+'"');

        if (authorSelectResult.length > 1) {
            throw new Error('Multiple authors with same name - possible case (Tolstoy as example) - logic not implemented for such case');
        }
        await dbConnection.beginTransaction();

        let authorId;
        if (!authorSelectResult.length) {
            const authorInsertResult = await dbConnection.query('INSERT INTO Authors (name) VALUES ("' + dbConnection.escape(params.author) + '")');
            authorId = authorInsertResult.insertId;
        } else {
            authorId = authorSelectResult[0].author_id;
        }

        const imageInsertResult = await dbConnection.query('INSERT INTO Images (path) VALUES ("' + dbConnection.escape(imageDestination) + '")');

        let imageId = imageInsertResult.insertId;
        const sqlQuery = 'INSERT INTO Books (title, date, author_id, description, image_id) VALUES (' +
            dbConnection.escape(params.title) + ', ' +
            dbConnection.escape(params.date) + ', ' +
            authorId + ',' +
            dbConnection.escape(params.description) + ', ' +
            imageId + ')';

        const bookInsertResult = await dbConnection.query(sqlQuery);

        try {
            await dbConnection.commit();
            return bookInsertResult.insertId;
        } catch(e) {
            await dbConnection.rollback();
            throw new Error('transaction failed');
        }
    },
    find: async function() {
        await dbConnection.query('SELECT * FROM books');
    },
    modify: function() {

    }
};

module.exports = bookModel;