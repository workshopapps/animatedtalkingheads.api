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
    
    auth_email: {
      type: 'string',
      description:
      'Email used during authentication',
      example: 'default@gmail.com',
    },
    auth_password: {
      type: 'string',
      description:
      'The users password',
      example: 'defaultpassword',
    },
    amount: {
      type: 'number',
      description:
      'The amount being subscribed for',
      example:500,
    },
    full_name: {
      type: 'string',
      description:
      'The fullname of the user subscribing',
      example: 'John Not-Doe',
    },
    email: {
      type: 'string',
      description:
      'The email of the user subscribing',
      example: 'johndefinitelynot-doe@gmail.com',
    },
    
  
    
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            $ref: '#/components/id',
          },
          last_time_accessed: {
            type: 'date',
            description: 'timestamp of when the user last used the website',
            example: '2016-05-18T16:00:00Z',
          },
        },
      },
      Payment: {
        type: 'object',
        properties: {
          amount: {
            $ref: '#/components/amount',
          },
          full_name: {
            $ref: '#/components/full_name',
          },
          email: {
            $ref: '#/components/email',
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
      Authentication: {
        type: 'object',
        properties: {
          email: {
            $ref: '#/components/auth_email',
          },
          password: {
            $ref: '#/components/auth_password',
          },
          
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
