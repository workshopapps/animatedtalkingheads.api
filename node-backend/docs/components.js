module.exports = {
  components: {
    securitySchemes:{
    bearerAuth:{
      type:'http',
      scheme: 'bearer',
      bearerFormat:"JWT"
    }
  },
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
      description: 'The id of the user customizing avatar',
      example: '637747b42342eb4566c90133',
    },
    forgot_email: {
      type: 'string',
      description: 'Email used to register',
      example: 'example@gmail.com',
    },
    contact_name:{
      type: 'string',
      description: 'name of someone contacting',
      example: 'shegz Olode',
    },
    contact_email:{
      type: 'string',
      description: 'email of someone contacting',
      example: 'shegz@gmail.com',
    },
    contact_message:{
      type: 'string',
      description:'message',
      example: 'Hi there i am testing',
    },

    auth_email: {
      type: 'string',
      description: 'Email used during authentication',
      example: 'default@gmail.com',
    },
    auth_password: {
      type: 'string',
      description: 'The users password',
      example: 'defaultpassword',
    },
    amount: {
      type: 'number',
      description: 'The amount being subscribed for',
      example: 500,
    },
    full_name: {
      type: 'string',
      description: 'The fullname of the user subscribing',
      example: 'John Not-Doe',
    },
    email: {
      type: 'string',
      description: 'The email of the user subscribing',
      example: 'johndefinitelynot-doe@gmail.com',
    },
    youtube:{
      type:'boolean',
      description:'do you want your videos linked to your social media?',
      example:false

    },
    twitter:{
      type:'boolean',
      description:'do you want your videos linked to your social media?',
      example:true

    },
    facebook:{
      type:'boolean',
      description:'do you want your videos linked to your social media?',
      example:false

    },
    googleDrive:{
      type:'boolean',
      description:'do you want your videos linked to your social media?',
      example:false

    },
    oneDrive:{
      type:'boolean',
      description:'do you want your videos linked to your social media?',
      example:false

    },
    dropBox:{
      type:'boolean',
      description:'do you want your videos linked to your social media?',
      example:false

    },
    instagram:{
      type:'boolean',
      description:'do you want your videos linked to your social media?',
      example:true

    },
    linkedIn:{
      type:'boolean',
      description:'do you want your videos linked to your social media?',
      example:false

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
          
        },
      },
      UserSettings:{
        type:'object',
        properties:{
          youtube: {
            $ref: '#/components/youtube',
          },
          twitter: {
            $ref: '#/components/twitter',
          },
          facebook: {
            $ref: '#/components/facebook',
          },
          googleDrive: {
            $ref: '#/components/googleDrive',
          },
          oneDrive: {
            $ref: '#/components/oneDrive',
          },
          dropBox: {
            $ref: '#/components/dropBox',
          },
          instagram: {
            $ref: '#/components/instagram',
          },
          linkedIn: {
            $ref: '#/components/linkedIn',
          },
      }
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
      Contact: {
        type: 'object',
        properties: {
          name: {
            $ref: '#/components/contact_name',
          },
          email: {
            $ref: '#/components/contact_email',
          },
          message: {
            $ref: '#/components/contact_message',
          },
        },
      },
      Password: {
        type: 'object',
        properties: {
          email: {
            $ref: '#/components/forgot_email',
          },
        },
      },
      AvatarInput: {
        type: 'object',
        properties: {
          head_file_path: {
            $ref: '#/components/head_file_path',
          },
          scene_file_path: {
            $ref: '#/components/scene_file_path',
          },

          user_id: { $ref: '#/components/user_id' },
        },
      },
    },
  },
};
