const { PythonShell } = require('python-shell');
const path = require('path');

module.exports = async ({ data: { jobConfig } }) => {
  let options = {
    mode: 'text',
    pythonOptions: ['-u'],
    pythonPath: path.resolve(
      path.dirname(process.cwd() + '/') +
        '/pyhton-backend/venv/Scripts/python.exe'
    ),
    scriptPath: path.resolve(
      path.dirname(process.cwd() + '/') +
        '/pyhton-backend/src/podcast_animator/'
    ),

    args: [jobConfig.meta_json_file],
  };

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
      reject({ err });
    }
  });
};
