module.exports = {
  paths: {
    '/podcasts/upload': {
      post: {
        tags: ['Podcast'],
        description: 'Upload a podcast',
        operationId: 'uploadPodcast',

        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  podcast: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Podcast created successfully',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/animated-videos/{animatedVideoId}': {
      get: {
        tags: ['AnimatedVideo'],
        description: 'Upload a podcast',
        operationId: 'uploadPodcast',
        parameters: [
          {
            in: 'path',
            name: 'animatedVideoId',
            schema: {
              type: 'string',
            },
            required: true,
            description: 'ID of the podcast to use',
          },
          {
            in: 'header',
            name: 'user_id',
            schema: {
              type: 'string',
            },
            required: true,
            description: 'ID of the user to use, put in headers',
          },
        ],
        responses: {
          201: {
            description: 'Podcast created successfully',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/animated-videos/': {
      get: {
        tags: ['AnimatedVideo'],
        description: 'Upload a podcast',
        operationId: 'uploadPodcast',
        parameters: [
          {
            in: 'header',
            name: 'user_id',
            schema: {
              type: 'string',
            },
            required: true,
            description: 'ID of the user to use, put in headers',
          },
        ],
        responses: {
          201: {
            description: 'Podcast created successfully',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/podcasts/{podcastID}/generate-video': {
      post: {
        tags: ['Podcast'],
        description: 'Upload a podcast',
        operationId: 'uploadPodcast',
        parameters: [
          {
            in: 'path',
            name: 'podcastID',
            schema: {
              type: 'integer',
            },
            required: true,
            description: 'ID of the podcast to use',
          },
          {
            in: 'header',
            name: 'user_id',
            schema: {
              type: 'integer',
            },
            required: true,
            description: 'ID of the user to use, placed  in the headers',
          },
        ],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  podcast: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Podcast created successfully',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
  },
};
