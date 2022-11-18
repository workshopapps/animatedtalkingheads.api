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
    style: {
      type: 'string',
      description: 'how that particular avatar might look like might look like',
      example: 'shirt',
    },
    color: {
      type: 'string',
      description: 'how the cloth might look like',
      example: 'red',
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
          id: {
            $ref: '#/components/id',
          },
          podcast_id: {
            $ref: '#/components/id',
          },
          accessories: {
            type: 'object',
            properties: {
              cloth_type: { $ref: '#/components/id' },
              skin_type: { $ref: '#/components/id' },
              hair_type: { $ref: '#/components/id' },
            },
          },
          gender: {
            type: 'string',
            required: true,
            enum: ['male', 'female', 'neutral'],
          },
          user_id: { $ref: '#/components/id' },
        },
      },
      ClothType: {
        type: 'object',
        properties: {
          style: {
            $ref: '#/components/style',
          },
          color: {
            $ref: '#/components/color',
          },
          file_path: {
            $ref: '#/components/id',
          },
        },
      },
      SkinType: {
        type: 'object',
        properties: {
          color: {
            $ref: '#/components/color',
          },
          file_path: {
            $ref: '#/components/id',
          },
        },
      },
      HairType: {
        type: 'object',
        properties: {
          style: {
            $ref: '#/components/style',
          },
          color: {
            $ref: '#/components/color',
          },
          file_path: {
            $ref: '#/components/id',
          },
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
