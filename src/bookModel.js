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
    find: async function(params) {
        let orderBy = '', limit = '',offset = '', where = '';
        if (params.sort.length) {
            orderBy = 'ORDER BY ';
            params.sort.forEach(column => {
                let columnFullName;
                if (column.field === 'author') {
                    columnFullName = 'Authors.name';
                } else {
                    columnFullName = 'Books.' + column.field;
                }
                orderBy += columnFullName + ' ' + column.order + ' ';
            });
        }

        if (params.pagination.offset) {
            offset = 'OFFSET ' + dbConnection.escape(params.pagination.offset);
        }

        if (params.pagination.limit) {
            limit = 'LIMIT ' + dbConnection.escape(params.pagination.limit) + ' ';
        }

        if (Object.keys(params.filters).length) {
            where = 'WHERE ';
            let isFirst = true;
            for (let column in params.filters) {
                if (params.filters.hasOwnProperty(column) && params.filters[column]) {
                    let columnFullName = isFirst ? '' : 'AND ';
                    if (column === 'author') {
                        columnFullName += 'Authors.name';
                    } else {
                        columnFullName += 'Books.' + column;
                    }
                    where += columnFullName + ' LIKE ' + dbConnection.escape('%' + params.filters[column] + '%') + ' ';
                    isFirst = false;
                }
            }
        }

        const sqlQuery = 'SELECT * FROM ((Books LEFT JOIN Authors ON Books.author_id = Authors.author_id) LEFT JOIN Images ON Books.image_id = Images.image_id) ' +
            where + orderBy + limit + offset;

        return await dbConnection.query(sqlQuery);
    },
    modify: async function(params) {
        let authorId;
        if (params.author) {
            const authorSelectResult = await dbConnection.query('SELECT author_id FROM Authors WHERE name = "' + dbConnection.escape(params.author) + '"');
            if (authorSelectResult.length > 1) {
                throw new Error('Multiple authors with same name - possible case (Tolstoy as example) - logic not implemented for such case');
            } else if (authorSelectResult.length) {
                authorId = authorSelectResult[0].author_id;
            }
        }

        await dbConnection.beginTransaction();

        if (!authorId && params.author) {
            const authorInsertResult = await dbConnection.query('INSERT INTO Authors (name) VALUES ("' + dbConnection.escape(params.author) + '")');
            authorId = authorInsertResult.insertId;
        }

        if (params.title || params.date || authorId || params.description) {
            const sqlQuery = 'UPDATE Books SET '+
                (params.title ? ('title =' + dbConnection.escape(params.title) + ',') : '') +
                (params.date ? ('date =' + dbConnection.escape(params.date) + ',') : '') +
                (authorId ? ('author_id =' + authorId + ',') : '') +
                (params.description ? ('description =' + dbConnection.escape(params.description)) : '') +
                'WHERE book_id = ' + dbConnection.escape(params.bookId);

            await dbConnection.query(sqlQuery);
        }

        try {
            await dbConnection.commit();
        } catch(e) {
            await dbConnection.rollback();
            throw new Error('transaction failed');
        }
    }
};

module.exports = bookModel;