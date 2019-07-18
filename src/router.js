const Router = require('koa-router');
const router = new Router();
const bookGetController = require('./bookGetController');
const bookAddController = require('./bookAddController');
const bookModifyController = require('./bookModifyController');
const cacheManager = require('./cacheManager');

router
    .get('/books', async (ctx, next) => {
        const cached = cacheManager.get(ctx.originalUrl);
        if (cached) {
            ctx.body = cached;
        } else {
            ctx.body = await bookGetController.getBooks(ctx.query);
            cacheManager.set(ctx.originalUrl, ctx.body);
        }
    })
    .post('/add', async (ctx, next) => {
        cacheManager.invalidate();
        ctx.body = await bookAddController.addBook(ctx.request.body, ctx.request.files.image);
    })
    .post('/modify', async (ctx, next) => {
        cacheManager.invalidate();
        ctx.body = await bookModifyController.modifyBook(ctx.request.body, ctx.request.files.image);
    });

module.exports = { router };
