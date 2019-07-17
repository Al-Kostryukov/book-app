const bookModel = require('./bookModel');
const RESTParser = require('./restParser');


const bookGetController = {
    getBooks: function(query) {
        const parser = new RESTParser(['title', 'date', 'author', 'description']);
        const params = parser.parse(query);
        bookModel.find(params);

        return {success: true, return: [{title: '5', author: 'ttt'}]};
    }
};

module.exports = bookGetController;