declare module 'kf-router' {
  import koa from 'koa';

  function kfRouter(rootPath?: string): (ctx: koa.Context) => Promise<any>;
  export = kfRouter;
}

declare module 'sqlongo' {
  class AsyncDatabase {
    public run(sql: string, param?: any): Promise<any>;
    public get(sql: string, param?: any): Promise<any>;
    public all(sql: string, param?: any): Promise<any>;
  }
  const Sqlongo: {
    (dbName: string): any;
    defaults: {
      path: string;
    };
    AsyncDatabase: typeof AsyncDatabase
  };
  export = Sqlongo;
}
