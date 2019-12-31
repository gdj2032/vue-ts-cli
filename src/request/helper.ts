import { IRequestParams } from './request.d';

/* tslint:disable:no-empty */
const noop = () => {};

function genQuery(params?: IRequestParams) {
    if (!params) {
        return '';
    }
    let index = 0;
    let query = '';
    Object.keys(params).forEach((name) => {
      if (params[name] !== undefined && params[name] !== null) {
        query += (index === 0 ? '?' : '&');
        const value = params[name];
        query += `${name}=${value}`;
        index += 1;
      }
    });
    return query;
}

/**
 * 允许超时中止的Promise
 * @param {Promise} basePromise
 * @param {number} timeout
 */
const abortablePromise = (basePromise: Promise<any>, timeout: number = 5000) => {
  let abortFunc: () => void;

  const abortPromise = new Promise((_, reject) => {
      abortFunc = () => {
          reject('request timeout');
      };
  });

  const newPromise = Promise.race([
      basePromise,
      abortPromise
  ]);

  setTimeout(() => {
      abortFunc();
  }, timeout);

  return newPromise;
}

export {
  noop,
  genQuery,
  abortablePromise,
};
