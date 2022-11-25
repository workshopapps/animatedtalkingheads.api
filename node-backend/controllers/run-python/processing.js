const { PythonShell } = require('python-shell');
const path = require('path');
const runPy = async (script) => {
  console.log(
    path.resolve(
      path.dirname(process.cwd() + '/') +
        '/scripts/pyhton-backend/test_data/meta.json'
    )
  );

  let options = {
    mode: 'text',
    pythonOptions: ['-u'],

    args: [
      path.resolve(
        path.dirname(process.cwd() + '/') +
          '/pyhton-backend/test_data/meta.json'
      ),
    ],
  };

  return new Promise(function (resolve, reject) {
    PythonShell.runString(
      path.resolve(
        path.resolve(
          path.dirname(process.cwd() + '/') +
            'pyhton-backend/src/podcast_animator/generator/main.py'
        ),
        options
      ),
      function (err, res) {
        console.log(err);
        if (err) reject(err);
        resolve(res[0]);
      }
    );
  });
};

module.exports = async (job) => {
  const pyres = await runPy(job.data);
  console.log(pyres.toUpperCase());
  return pyres.toUpperCase();
};
