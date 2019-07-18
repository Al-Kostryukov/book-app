const bookModel = require('./bookModel');
const fsExtra = require('fs-extra');

const bookAddController = {
    addBook: async function(params, image) {
        if (!this.checkAllFields(params) || !image) {
            return {success: false, return: {error: 'SOME_FIELDS_EMPTY'}}
        }
        // avoid fs slowdown - create random folders /inside upload
        // good to use hashes here, but random numbers will be ok for demo
        const imageDestination = 'uploads/' + Math.floor(Math.random() * 1000) + '/' + Math.random() + image.name; // use join from path
        const imageDestinationFullPath = __dirname + '/../' + imageDestination;
        try {
            await fsExtra.move(
                image.path,
                imageDestinationFullPath
            );
        } catch (e) {
            // winston log error - no time to implement
            return {success: false, return: {error: 'UNKNOWN_EXCEPTION'}}
        }

        try {
            const bookId = await bookModel.add(params, imageDestination);
            return {success: true, return: {bookId: bookId}};
        } catch (e) {
            // winston log error - no time to implement
            return {success: false, return: {error: 'UNKNOWN_EXCEPTION'}}
        }
    },

    checkAllFields: function(fields) {
        return fields.title && fields.date && fields.author && fields.description;
    }
};

module.exports = bookAddController;