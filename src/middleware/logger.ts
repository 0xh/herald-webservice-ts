/*
  # 日志中间件

  代替 koa 的日志中间件，为了解析 return.js 中间件返回的 JSON 状态码，并且为了好看。
 */
import koa from 'koa';
import chalk from 'chalk';

export = async (ctx: koa.Context, next: () => Promise<any>) => {
  const begin = moment();
  await next();
  const end = moment();
  const duration = end.valueOf() - begin.valueOf();
  const time = end.format('H:mm:ss');

  // 考虑到某些情况（如重定向）时，返回中没有 JSON 格式的 body，只有 status
  const status = ctx.body && ctx.body.code || ctx.status;

  // 可读性log，用于美观和增加可读性
  const logMsg = ctx.logMsg;

  console.log(
    '  ' + time +
    ' | ' + (status < 400 ? chalk.green(status) : chalk.red(status)) +
    ' ' + ctx.method +
    ' ' + chalk.blue(ctx.path) +
    ' ' + duration + 'ms' +
    (logMsg ? ' | ' + chalk.yellow(logMsg) : '')
  );
};
