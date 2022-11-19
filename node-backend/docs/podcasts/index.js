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
