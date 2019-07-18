const Router = require('koa-router');
const router = new Router();
const bookGetController = require('./bookGetController');
const bookAddController = require('./bookAddController');
const bookModifyController = require('./bookModifyController');
//koaBody = convert(KoaBody());

router
    .get('/books', async (ctx, next) => {
        // here we can cache request using Redis (for example) - can implement it later
        ctx.body = await bookGetController.getBooks(ctx.query);
    })
    .post('/add', async (ctx, next) => {
        ctx.body = await bookAddController.addBook(ctx.request.body, ctx.request.files.image);
    })
    .post('/modify', async (ctx, next) => {
        ctx.body = await bookModifyController.modifyBook(ctx.request.body, ctx.request.files.image);
    });

module.exports = { router };

