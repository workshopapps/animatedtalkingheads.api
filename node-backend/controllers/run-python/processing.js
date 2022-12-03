const { PythonShell } = require('python-shell');
const path = require('path');

module.exports = async ({ data: { jobConfig } }) => {
  console.log(jobConfig);
  let options = {
    mode: 'text',
    // pythonPath: 'c/Users/Hi/AppData/Local/Microsoft/WindowsApps/python3',
    pythonOptions: ['-u'],
    scriptPath: path.resolve(
      path.dirname(process.cwd() + '/') +
        '/pyhton-backend/src/podcast_animator/generator/'
    ),

    args: [jobConfig.meta_json_file],
  };

  return new Promise(function (resolve, reject) {
    PythonShell.run('/main.py', options, function (err, res) {
      if (err) {
        console.error(err);
        return reject({ err });
      }
      console.log('success');
      resolve({ success: true, jobConfig });
    });
  });
};
