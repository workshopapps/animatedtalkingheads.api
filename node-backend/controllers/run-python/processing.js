const { PythonShell } = require('python-shell');
const path = require('path');

const pythonExeFile =
  process.env.NODE_ENV == 'development'
    ? '/pyhton-backend/venv/Scripts/python.exe'
    : '/pyhton-backend/.venv/bin/python3.10';
module.exports = async ({ data: { jobConfig } }) => {
  let options = {
    mode: 'text',
    pythonOptions: ['-u'],
    pythonPath: path.resolve(path.dirname(process.cwd() + '/') + pythonExeFile),
    scriptPath: path.resolve(
      path.dirname(process.cwd() + '/') +
        '/pyhton-backend/src/podcast_animator/'
    ),

    args: [jobConfig.meta_json_file],
  };
  console.log(
    path.resolve(
      path.dirname(process.cwd() + '/') +
        '/pyhton-backend/src/podcast_animator/'
    ) + 'start.py'
  );
  return new Promise(function (resolve, reject) {
    try {
      return PythonShell.run('start.py', options, function (err, res) {
        if (err) {
          console.error(err);
          reject({ err });
        }
        console.log(res);
        resolve({ success: true, jobConfig });
      });
    } catch (err) {
      console.error(err);
      reject({ err });
    }
  });
};
