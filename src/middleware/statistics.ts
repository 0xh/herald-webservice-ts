import db from '../database/stat';
import koa from 'koa';

export = async (ctx: koa.Context, next: () => Promise<any>) => {
  const start = +moment();
  try {
    await next();
  } finally {
    try {
      const end = +moment();
      const time = start;
      const duration = end - start;
      const identity = ctx.user && ctx.user.isLogin ? ctx.user.identity : 'guest';
      const platform = ctx.user && ctx.user.isLogin ? ctx.user.platform : 'guest';
      const route = ctx.path;
      const method = ctx.method.toLowerCase();

      // 考虑到某些情况（如重定向）时，返回中没有 JSON 格式的 body，只有 status
      const status = ctx.body && ctx.body.code || ctx.status;
      const record = { time, identity, platform, route, method, status, duration };
      // profile
      const profileStart = +moment();
      await db.stat.insert(record);
      if (process.env.NODE_ENV === 'profile') {
        const profileEnd = +moment();
        console.log(`[Profile] 写入日志 ${profileEnd - profileStart} ms`);
      }
    } catch (e) {
      console.error(e);
    }
  }
};
