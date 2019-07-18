const bookModel = require('./bookModel');

const bookModifyController = {
    modifyBook: async function(params, image) {
        // currently no image update - but can implement it later
        if (!params.bookId) {
            return {success: false, return: {error: 'BOOK_ID_IS_EMPTY'}};
        }
        try {
            await bookModel.modify(params);
            return {success: true};
        } catch (e) {
            // winston log error - no time to implement
            return {success: false, return: {error: 'UNKNOWN_EXCEPTION'}}
        }
    }
};

module.exports = bookModifyController;