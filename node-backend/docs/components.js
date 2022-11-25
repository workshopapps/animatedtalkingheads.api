module.exports = {
  components: {
    
    head_file_path: {
      type: 'string',
      description:
      'The file_path can point the dir containing user preffered avatar head',
      example: '.assets/Avatars-front/Avatars-01.png',
    },
    scene_file_path: {
      type: 'string',
      description:
      'The file_path can point the dir containing user preffered avatar background',
      example: '.assets/scenery/background1.png',
    },
    user_id: {
      type: 'string',
      description:
      'The id of the user customizing avatar',
      example: '637747b42342eb4566c90133',
    },
    
    
  
    
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            $ref: '#/components/id',
          },
          // name: {
          //   type: 'string',
          //   description: 'name of a temp user',
          //   example: 'aaron kenny',
          // },
          last_time_accessed: {
            type: 'date',
            description: 'timestamp of when the user last used the website',
            example: '2016-05-18T16:00:00Z',
          },
        },
      },
      Podcast: {
        type: 'object',
        properties: {
          id: {
            $ref: '#/components/id',
          },
          file_path: { $ref: '#/components/file_path' },
          user_id: { $ref: '#/components/id' },
        },
      },
      PodcastInput: {
        type: 'object',
        properties: {
          file_path: { $ref: '#/components/file_path' },
          user_id: { $ref: '#/components/id' },
        },
      },
      AvatarInput: {
        type: 'object',
        properties: {
          head_file_path:{
            $ref:'#/components/head_file_path'
          },
          scene_file_path:{
            $ref:'#/components/scene_file_path'
          },
    
      user_id: { $ref: '#/components/user_id' },
        },
      },
      
    },
    // Error_Types: {
    //   type: 'object',
    //   properties: {
    //     message: {
    //       type: 'string',
    //     },
    //     internal_code: {
    //       type: 'string',
    //     },
    //   },
    // },
  },
};
