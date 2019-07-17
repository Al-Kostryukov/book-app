const bookModel = require('./bookModel');

const bookAddController = {
    addBook: function(params, image) {

        return {success: true, return: [{title: '5', author: 'ttt'}]};
    }
};

module.exports = bookAddController;