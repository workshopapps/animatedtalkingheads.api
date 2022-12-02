const { PythonShell } = require('python-shell');
const path = require('path');

export const runPy = async ({ jobConfig }) => {
  let options = {
    mode: 'text',
    pythonOptions: ['-u'],

    args: [jobConfig.meta_json_file],
  };

  return new Promise(function (resolve, reject) {
    PythonShell.run(
      path.resolve(
        path.dirname(process.cwd() + '/') +
          'pyhton-backend/src/podcast_animator/generator/main.py'
      ),
      options,
      function (err, res) {
        if (err) {
          console.error(err);
          reject({ err });
        }
        resolve({ success: true, jobConfig });
      }
    );
  });
};
