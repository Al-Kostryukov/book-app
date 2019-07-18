const bookModel = require('./bookModel');
const RESTParser = require('./restParser');


const bookGetController = {
    getBooks: async function(query) {
        const parser = new RESTParser(['title', 'date', 'author', 'description']);
        const params = parser.parse(query);

        try {
            const results = await bookModel.find(params);
            const processedResults = results.map(result => ({
                bookId: result.book_id,
                title: result.title,
                author: result.name,
                date: result.date,
                description: result.description,
                image: result.path
            }));
            return {success: true, return: processedResults};
        } catch (e) {
            return {success: false, return: {error: 'UNKNOWN_EXCEPTION'}};
        }
    }
};

module.exports = bookGetController;