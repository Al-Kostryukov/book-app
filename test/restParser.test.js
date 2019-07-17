const chai = require("chai");
const RESTParser = require("../src/restParser");
const expect = chai.expect;

describe("Parse query", () => {
    it("should parse sort", () => {
        const parser = new RESTParser(['title', 'date', 'author', 'description']);
        const query = { sort: '-title,+date', title: 'Idiot', author: 'Dostoevsky' };
        const params = parser.parse(query);
        expect(params.sort).to.eql([ { field: 'title', order: 'DESC' }, { field: 'date', order: 'ASC' } ]);
    });
});

