import koa from 'koa';
// 允许的第三方前端域名，精确匹配
const allowDomains: Array<(domain: string) => boolean> = [
  dm => dm.endsWith('.myseu.cn'),
  dm => dm === 'myseu.cn',
  dm => dm === 'app.heraldstudio.com',
  dm => dm === 'www.heraldstudio.com',
  dm => dm === 'localhost',
  dm => dm.startsWith('127.') || dm.startsWith('172.') || dm.startsWith('192.'),
];

export = async (ctx: koa.Context, next: () => Promise<any>) => {
  const { origin } = ctx.request.headers;
  if (origin) {
    // 不考虑端口和协议
    const domain = (origin.split('/').slice(-1)[0] || '').split(':')[0] || '';
    if (domain && allowDomains.find(d => d(domain))) {
      ctx.set('Access-Control-Allow-Origin', origin);
      ctx.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,PATCH');
      ctx.set('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,token,cache');
    }
  }
  if (ctx.method.toUpperCase() === 'OPTIONS') {
    ctx.body = '';
    ctx.status = 200;
  } else {
    await next();
  }
};
