const Podcast = require('../models/Podcast')
const path = require('path')
const fs = require('fs');
const ApiError = require('../utils/errors/ApiError');

//deletes directory of podcast and deletes podcast data from the database aswell
const delpodcast = async (req, res,next) => {
    try{
      let podcast = await Podcast.findById(req.podcastId)
      const poddirectory = path.join(__dirname,'..', `/${podcast.file_path}`)
      fs.unlink(path.join(`${poddirectory}`), err => {
        if (err) throw err;
        
      });
      await podcast.remove()

      
      res.send('Podcast successfully deleted.');
    }
  
    catch(error){
      cb(new ApiError('Deleting failed.', 400), false);
    }
    }
    
    module.exports = delpodcast