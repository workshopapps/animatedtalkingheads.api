const Podcast = require('../models/Podcast')
const path = require('path')
const fs = require('fs');

//deletes directory of podcast and deletes podcast data from the database aswell
const delpodcast = async (req, res,next) => {
    try{
      let podcast = await Podcast.findById(req.podcastId)
      const poddirectory = path.join(__dirname,'..', `/${podcast.file_path}`)
      fs.unlink(path.join(`${poddirectory}`), err => {
        if (err) throw err;
        
      });
      await podcast.remove()

      
      res.send('podcast deleted.');
    }
  
    catch(error){
      next(error)
    }
    }
    
    module.exports = delpodcast