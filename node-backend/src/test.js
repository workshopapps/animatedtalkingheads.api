const any = function (promisesArray) {
  const promiseErrors = new Array(promisesArray.length);
  let counter = 0;

  //return a new promise
  return new Promise((resolve, reject) => {
    promisesArray.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(resolve) // resolve, when any of the input promise resolves
        .catch((error) => {
          promiseErrors[index] = error;
          counter = counter + 1;
          if (counter === promisesArray.length) {
            // all promises rejected, reject outer promise
            reject(undefined);
          }
        }); // reject, when any of the input promise rejects
    });
  });
};

async function firstSuccessfulPromise(promiseArray) {
  const res = any(promiseArray).catch((err) => {});

  return res;
}

let promise = firstSuccessfulPromise([
  new Promise((resolve, reject) => reject()),
  new Promise((resolve, reject) => reject()),
]);

promise.then((result) => console.log(result));

module.exports.firstSuccessfulPromise = firstSuccessfulPromise;
