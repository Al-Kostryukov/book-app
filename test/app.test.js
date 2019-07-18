const fs = require("fs");
const chai = require("chai");
const chaiHttp = require("chai-http");
const fsExtra = require('fs-extra');
const { server, dbConnection } = require("../src/app");
const expect = chai.expect;

chai.use(chaiHttp);
describe("App REST test", () => {
    after(() => {
        server.close();
        dbConnection.end();
        fsExtra.emptyDirSync(__dirname + '/../uploads/');
        fsExtra.createFile(__dirname + '/../uploads/.githere');
    });

    describe("Get books simple", () => {
        it("should get books", done => {
            chai
                .request(server)
                .get("/books")
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    const resJson = JSON.parse(res.text);
                    expect(resJson).to.be.an('object').that.has.all.keys('return', 'success');
                    expect(resJson.success).to.be.equal(true);
                    expect(resJson.return).to.be.an('array');
                    done();
                });
        });

        it("should get books cached", done => {
            chai
                .request(server)
                .get("/books")
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    const resJson = JSON.parse(res.text);
                    expect(resJson).to.be.an('object').that.has.all.keys('return', 'success');
                    expect(resJson.success).to.be.equal(true);
                    expect(resJson.return).to.be.an('array');
                    done();
                });
        });
    });

    describe("Get books sorted", () => {
        it("should get books", done => {
            chai
                .request(server)
                .get("/books?sort=-author")
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    const resJson = JSON.parse(res.text);
                    expect(resJson).to.be.an('object').that.has.all.keys('return', 'success');
                    expect(resJson.success).to.be.equal(true);
                    expect(resJson.return).to.be.an('array');
                    done();
                });
        });
    });

    describe("Get books filtered", () => {
        it("should get books", done => {
            chai
                .request(server)
                .get("/books?title=Idiot&author=Dostoevsk&sort=-date&offset=1&limit=2")
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    const resJson = JSON.parse(res.text);
                    expect(resJson).to.be.an('object').that.has.all.keys('return', 'success');
                    expect(resJson.success).to.be.equal(true);
                    expect(resJson.return).to.be.an('array');
                    done();
                });
        });
    });

    describe("Add book", () => {
        it("Add book", done => {
            chai
                .request(server)
                .post("/add")
                .attach('image', fs.readFileSync(__dirname + '/test-image.jpg'), 'test-image.jpg')
                .field({
                    title: 'Idiot',
                    author: 'Fedor Dostoevsky',
                    description: 'Description of the book',
                    date: '1869-01-01'
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    const resJson = JSON.parse(res.text);
                    expect(resJson).to.be.an('object').that.has.all.keys('return', 'success');
                    expect(resJson.success).to.be.equal(true);
                    done();
                });
        });
    });

    describe("Modify book", () => {
        it("Modify book simple", done => {
            chai
                .request(server)
                .post("/modify")
                .field({
                    bookId: 2,
                    title: 'Idiot - upd',
                    author: 'Fedor Dostoevsky- upd',
                    description: 'Description of the book - upd',
                    date: '2069-01-01'
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    const resJson = JSON.parse(res.text);
                    expect(resJson).to.be.an('object').that.has.all.keys('success');
                    expect(resJson.success).to.be.equal(true);
                    done();
                });
        });
    });
});


