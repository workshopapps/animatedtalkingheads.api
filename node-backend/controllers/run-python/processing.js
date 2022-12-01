const { PythonShell } = require('python-shell');
const path = require('path');

const runPy = async () => {
  let options = {
    mode: 'text',
    pythonOptions: ['-u'],

    args: [
      path.resolve(
        path.dirname(process.cwd() + '/') +
          '/pyhton-backend/test_data/meta2.json'
      ),
    ],
  };

  return new Promise(function (resolve, reject) {
    PythonShell.run(
      path.resolve(
        path.resolve(
          path.dirname(process.cwd() + '/') +
            'pyhton-backend/src/podcast_animator/generator/main.py'
        ),
        options
      ),
      function (err, res) {
        console.error(err);
        if (err) reject(err);
        resolve(res[0]);
      }
    );
  });
};

module.exports = async (job) => {
  const pyres = await runPy(job.data);

  return pyres;
};
