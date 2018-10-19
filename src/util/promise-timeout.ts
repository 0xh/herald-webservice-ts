import { noop } from './util';

/**
 * 设置全局 Promise 的超时时间
 * 将改变全局 Promise 行为. Promise 超时将打印错误，并不再执行后续方法.
 */
export function setPromiseTimeout(timeout: number) {
  const _Promise = Promise
  Promise = class<T> {
    constructor(
      executor: (
        resolve: (value?: T | PromiseLike<T>) => void,
        reject: (reason?: any) => void,
      ) => void,
    ) {
      const originalPromise = new _Promise(executor)
      const timeoutError = new Error('Promise timed out.')
      const timeoutPromise = new _Promise((resolve, reject) => {
        setTimeout(() => reject(timeoutError), timeout)
      })
      return _Promise.race([timeoutPromise, originalPromise]).catch((e: Error) => {
        if (e === timeoutError) {
          console.error('[Promise Timeout]', e.stack!.split('\n').map(k => k.trim()).filter(k =>
            /:\d+:\d+\)$/.test(k) && k.indexOf('/node_modules/') === -1)[1] || 'at unknown source')

          // 返回一个不改变状态的 Promise ，取消执行后续方法
          return new _Promise(noop)
        } else {
          throw e
        }
      })
    }
  } as PromiseConstructor
  Promise.all = _Promise.all
  Promise.race = _Promise.race
  Promise.reject = _Promise.reject
  Promise.resolve = _Promise.resolve;
  (Promise as any).prototype = _Promise.prototype
}
