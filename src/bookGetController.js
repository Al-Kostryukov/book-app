const bookModel = require('./bookModel');
const RESTParser = require('./restParser');


const bookGetController = {
    getBooks: async function(query) {
        const parser = new RESTParser(['title', 'date', 'author', 'description']);
        const params = parser.parse(query);

        try {
            const result = await bookModel.find(params);
            return {success: true, return: result};
         catch (e) {
            return {success: false, return: {error: 'UNKNOWN_EXCEPTION'}};
        }
    }
};

module.exports = bookGetController;