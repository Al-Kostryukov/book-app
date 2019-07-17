const fs = require("fs");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { server } = require("../src/app");
const expect = chai.expect;

chai.use(chaiHttp);
describe("App REST test", () => {
    after(() => {
        server.close();
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
                .get("/books?title=Idiot&author=Dostoevsky")
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
        it("Add book simple", done => {
            chai
                .request(server)
                .post("/add")
                .attach('image', fs.readFileSync(__dirname + '/test-image.jpg'), 'test-image.jpg')
                .field({
                    title: 'Idiot',
                    author: 'Dostoevsky',
                    description: 'Description of the book',
                    date: '05.03.15'
                })
                //.field('fff', 'fff')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });
});


