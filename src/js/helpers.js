import { TIMEOUT_SEC } from './config.js';

function timeOut(s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
}

// This function will make an AJAX call to the Forkify API
export async function AJAX(url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
    ? fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // This is used to convert the data from the form into an object
        body: JSON.stringify(uploadData),
      })
    : fetch(url);

    const res = await Promise.race([fetchPro, timeOut(TIMEOUT_SEC)]);
    const data = await res.json(); // This will return a promise

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // This will return a rejected promise
    throw err;
  }
}

/*
export const getJSON = async function (url) {
  try {
    // If the promise gets rejected, the catch block will run and the error will be thrown.
    // This is because the fetch function will only reject the promise if there is a network error.
    // If the response is not ok, the promise will still be resolved.
    // So we need to throw an error if the response is not ok.
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeOut(TIMEOUT_SEC)]);
    const data = await res.json(); // This will return a promise

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // This will return a rejected promise
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    // Within the options object, the method property is set to 'POST'. This tells the messenger to use the HTTP POST method when making the request. Think of it as the messenger using a special delivery method, like mailing a letter (POST) instead of just asking for information (GET).
    // In the options, the headers property is used to specify additional information about the request. The Content-Type header indicates that the data being sent in the request body is in JSON format. It's like marking a package with a label that says, "This package contains a book" (indicating the content type).
    //  This means that the data you want to send with the request is converted into a JSON string format. Imagine you have a physical item you want to include in your package, and you put that item into a special format, like wrapping it in a gift box.
    // This is the data you want to send with the request. It could be any JavaScript object that you want to share with the server. For example, if you're sending user information, it might look like { name: 'Alice', age: 30 }.
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    };

    // This line initiates an HTTP request to a specified url using the fetch function. In simple terms, think of fetch as a messenger that goes to a web address (URL) and brings back a response.
    const fetchPro = fetch(url, options);

    const res = await Promise.race([fetchPro, timeOut(TIMEOUT_SEC)]);
    const data = await res.json(); // This will return a promise

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // This will return a rejected promise
    throw err;
  }
};
*/