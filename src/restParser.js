const config = require('./config');

class RESTParser {
    constructor(fields) {
        this.fields = new Set(fields);
    }

    parse(query) {
        const sort = this.parseSort(query);
        const filters = this.parseFilters(query);
        const pagination = this.parsePagination(query);

        return {sort, filters, pagination};
    }

    parseSort(query) {
        const sort = [];
        if (!query.sort) return sort;

        const order = new Map([['+', 'ASC'], ['-', 'DESC']]);

        query.sort.split(',').forEach(column => {
            const field = column.substring(1);
            if (!this.fields.has(field) || !order.has(column[0])) return;
            sort.push({field: field, order: order.get(column[0])});
        });

        return sort;
    }

    parseFilters(query) {
        const filters = {};
        for (let field of this.fields) {
            if (query[field]) {
                filters[field] = query[field]
            }
        }

        return filters;
    }

    parsePagination(query) {
        return {
            offset: parseInt(query.offset) || config.defaultOffset,
            limit: parseInt(query.limit) || config.defaultLimit
        };
    }
}

module.exports = RESTParser;