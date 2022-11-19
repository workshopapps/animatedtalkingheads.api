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
    '/podcasts/{userid}': {
      get: {
        tags: ['Podcast'],
        description: 'get all podcasts',
        operationId: 'getPodcast',
        parameters: [
          {
            in: 'formData',
            name: 'avatar',
            type: 'file',
            description: 'to get podcast uploaded.',
          },
        ],
        consumes: ['multipart/form-data'],

        responses: {
          201: {
            description: 'Podcast delivered',
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
 
    '/podcasts/{podcastid}': {
      delete: {
        tags: ['Podcast'],
        description: 'delete a podcast',
        operationId: 'deletePodcast',
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
            description: 'Podcast deleted successfully',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
  },
};
