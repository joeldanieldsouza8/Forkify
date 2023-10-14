import { TIMEOUT_SEC } from './config.js';

function timeOut(s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
}

export const getJSON = async function (url) {
  try {
    // If the promise gets rejected, the catch block will run and the error will be thrown.
    // This is because the fetch function will only reject the promise if there is a network error.
    // If the response is not ok, the promise will still be resolved.
    // So we need to throw an error if the response is not ok.
    const res = await Promise.race([fetch(url), timeOut(TIMEOUT_SEC)]);
    const data = await res.json(); // This will return a promise

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // This will return a rejected promise
    throw err;
  }
};
