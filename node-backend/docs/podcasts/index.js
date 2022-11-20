module.exports = {
  paths: {
    '/podcasts': {
      post: {
        tags: ['Podcast'],
        description: 'Upload a podcast',
        operationId: 'uploadPodcast',
        parameters: [
          {
            in: 'formData',
            name: 'avatar',
            type: 'file',
            description: 'The file to upload.',
          },
        ],
        consumes: ['multipart/form-data'],

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
    '/download': {
      get: {
        tags: ['Podcast'],
        description: 'Downloads a podcast',
        operationId: 'getPodcast',
        parameters: [
          {
            filename: 'path',
            schema: {
              $ref: '#/components/schemas/file_path',
            },
            required: true,
            description: 'file path for the podcast',
          },
        ],
        responses: {
          200: {
            description: 'Podcast found',
            content: 'audio/mpeg'
            },
          },
          404: {
            description: 'Podcast is not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                  example: {
                    message: "We can't find the podcast",
                    internal_code: 'Invalid file path',
                  },
                },
              },
            },
          },
        },
      },
      '/podcast/{userid}': {
        get: {
          tags: ['fetch all podcasts of user'],
          description: "Get user's podcasts",
          operationId: 'user id',
          parameters: [
            {
              name: 'id',
              in: 'path',
              schema: {
                $ref: '#/components/schemas/id',
              },
              required: true,
              description: 'user id',
            },
          ],
          responses: {
            200: {
              description: 'user podcasts fetched',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Todo',
                    example: {
                      _id: "8gfg8iu89ikjgi5",
                      user_id: 'kdf84ur8uf485u8u',
                      file_path: 'filepath/podcast_id/filepathname'
                    },
                  },
                },
              },
            },
            404: {
              description: 'Todo is not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                    example: {
                      message: "We can't find the todo",
                      internal_code: 'Invalid id',
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/podcast/{podcastid}': {
        delete: {
          tags: ['delete a podcast of user'],
          description: "delete user's podcast",
          operationId: 'podcast id',
          parameters: [
            {
              name: 'id',
              in: 'path',
              schema: {
                $ref: '#/components/schemas/id',
              },
              required: true,
              description: 'podcast id',
            },
          ],
          responses: {
            200: {
              description: 'user podcasts deleted',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Todo',
                   
                  },
                },
              },
            },
            404: {
              description: 'Todo is not found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                    example: {
                      message: "We can't find the todo",
                      internal_code: 'Invalid id',
                    },
                  },
                },
              },
            },
          },
        },
      },
  },
};
