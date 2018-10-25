/*
  # 计数器中间件

  在命令行最后一行显示当前请求计数器
 */
import koa from 'koa';
import ora from 'ora';

declare global {
  interface Console {
    [i: string]: any;
  }
}

const spinner = ora({
  spinner: {
    interval: 100,
    frames: ['→'],
  },
});

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'profile') {
  spinner.start();
}

const updateConnections = (count: number) => {
  spinner.text = count + ' 个请求运行中';
};

let connections = 0;
updateConnections(0);

Object.keys(console).forEach(key => {
  const original = console[key];
  console[key] = function() {
    spinner.stop();
    original.apply(this, arguments);
    switch (process.env.NODE_ENV) {
      case 'production': case 'profile':
        spinner.start();
    }
  };
});

console.log('');

const middleware = async (ctx: koa.Context, next: () => Promise<any>) => {
  updateConnections(++connections);
  try {
    await next();
  } finally {
    updateConnections(--connections);
  }
};

// 可导入本模块之后取 connections 获得当前连接数
Object.defineProperty(middleware, 'connections', {
  get() {
    return connections;
  },
});

export = middleware;
