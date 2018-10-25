/*
  # 路由自解释中间件
  提供能快速让接口列举其他相关接口的API，以便使用者灵活在接口之间穿梭，无需接口文档。

  ## 暴露接口
  ctx.related (route: string, description: string | object) => void  解释其他接口

  ## 用法举例
  //- /api/index.js
  this.related('card', {
    get: '{ date?: yyyy-M-d, page? } 一卡通信息及消费流水，不带 date 为当日流水',
    put: '{ password, amount: float, eacc?=1 } 一卡通在线充值'
  })
  this.related('srtp', 'SRTP 学分及项目查询') // 默认解释为 get 方法

  结果将会被 return（返回格式中间件）解析，放在返回 JSON 格式的 related 字段中。
 */
import koa from 'koa';

interface RelatedDescription {
  post?: any;
  get?: any;
  put?: any;
  delete?: any;
  [i: string]: any;
}

export = async (ctx: koa.Context, next: () => Promise<any>) => {
  const curPath = ctx.path.replace(/\/(index)?$/, '') + '/';
  ctx._related = [];
  ctx.related = (path: string, desc: string | RelatedDescription) => {
    const absPath = /^\//.test(path) ? path : curPath + path;
    if (typeof desc === 'string') {
      desc = { get: desc };
    }
    if (typeof desc === 'object') {
      const description = { url: absPath } as { url: string } & RelatedDescription;
      'post,get,put,delete'.split(',').map(k => description[k] = (desc as RelatedDescription)[k]);
      ctx._related.push(description);
    }
  };
  try {
    await next();
  } finally {
    if (!ctx._related.length) {
      (ctx._related as any) = undefined;
    }
  }
};
