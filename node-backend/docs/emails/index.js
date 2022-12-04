module.exports = {
    paths: {
      '/emails': {
        post: {
          tags: ['emails'],
          description: 'get email',
          operationId: 'getEmail',
          parameters: [
            {
              in: 'formData',
              name: 'email',
              type: 'link',
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
        
    },
  };
  