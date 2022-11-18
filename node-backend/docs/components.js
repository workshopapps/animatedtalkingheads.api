module.exports = {
  components: {
    id: {
      type: 'string',
      description: 'An id of a document, if used like user_id indicates a ref',
      example: '507f191e810c19729de860ea',
    },
    file_path: {
      type: 'string',
      description:
        'The file_path can point the dir containing a cloth, hair, skin png. It can also point to where a podcast or animated video is stored',
      example: './avatars/skin_black.png',
    },
    cloth_style: {
      type: 'string',
      description: 'avatar cloth',
      example: 'shirt',
    },
    hair_style:{
      type: 'string',
      description: 'avatar hairstyle',
      example: 'afro',
    },
    hair_color:{
      type: 'string',
      description: 'avatar hair color',
      example: 'blonde',
    },
    cloth_color: {
      type: 'string',
      description: 'how the cloth might look like',
      example: 'red',
    },
    skin_color: {
      type: 'string',
      description: 'skin color',
      example: 'brown',
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
          file_path:{
            $ref:'#/components/file_path'
          },
          id: {
            $ref: '#/components/id',
          },
          podcast_id: {
            $ref: '#/components/id',
          },
          accessories: {
            type: 'object',
            properties: {
              cloth_type: {
        type: 'object',
        properties: {
          style: {
            $ref: '#/components/cloth_style',
          },
          color: {
            $ref: '#/components/cloth_color',
          },
          file_path: {
            $ref: '#/components/file_path',
          },
        },
      },
      skin_type: {
        type: 'object',
        properties: {
          color: {
            $ref: '#/components/skin_color',
          },
          file_path: {
            $ref: '#/components/file_path',
          },
        },
      },
      hair_type: {
        type: 'object',
        properties: {
          style: {
            $ref: '#/components/hair_style',
          },
          color: {
            $ref: '#/components/hair_color',
          },
          file_path: {
            $ref: '#/components/file_path',
          },
        },
      },},
          },
      gender: {
            type: 'string',
            required: true,
            enum: ['male', 'female', 'neutral'],
          },
      user_id: { $ref: '#/components/id' },
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
