import koa from 'koa';

export = async (ctx: koa.Context, next: () => Promise<any>) => {
  await next();
  if (ctx.path.indexOf('/adapter-') === 0 && typeof ctx.body === 'object') {
    const code = ctx.body.code || ctx.status;
    if (code < 400) {
      ctx.body = ctx.body.result || 'OK';
    } else {
      ctx.body = {
        code: 400,
        reason: ctx.body.reason || 'error',
      };
    }
  }
};
