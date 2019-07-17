const Koa = require('koa');
const koaBody = require('koa-body');
const router = require('./router').router;
const dbConnection = require('./db');

const app = new Koa();

dbConnection.connect();

app.use(koaBody({
    multipart: true
}));
app.use(router.routes());

const server = app.listen(3000);

module.exports = {
    server
};