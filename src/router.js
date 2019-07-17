const Router = require('koa-router');
const router = new Router();
const bookGetController = require('./bookGetController');
const bookAddController = require('./bookAddController');
const bookModifyController = require('./bookModifyController');
//koaBody = convert(KoaBody());

router
    .get('/books', async (ctx, next) => {
        ctx.body = await bookGetController.getBooks(ctx.query);
    })
    .post('/add', async (ctx, next) => {
        ctx.body = await bookAddController.addBook(ctx.request.body, ctx.request.files.image);
        //let result = await product.get(ctx.params.id);
    })
    .post('/modify', async (ctx, next) => {
        ctx.status = 201;
        ctx.body = await product.create(ctx.request.body)
    });

module.exports = { router };

