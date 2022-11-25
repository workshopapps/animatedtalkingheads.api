module.exports = {
  paths: {

    '/podcasts/upload': {
      post: {
        tags: ['Podcast'],
        description: 'Upload a podcast',
        operationId: 'uploadPodcast',

        consumes: ['multipart/form-data'],
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
    '/avatars': {
      get: {
        tags: ['Avatars'],
        description: 'Get avatars',
        operationId: 'getAvatar',
        parameters: [],
        responses: {
          200: {
            description: 'avatars were obtained',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Todo',
                },
              },
            },
          },
        },
      },

    '/avatars':{
      post: {
        tags: ['Avatars'],
        description: 'Create Avatar',
        operationId: 'createAvatar',
        parameters: [],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AvatarInput',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Avatar created successfully',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/avatars/{id}': {
      get: {
        tags: ['fetch specific avatar'],
        description: "Get user's avatar",
        operationId: 'user avatar id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            schema: {
              $ref: '#/components/schemas/id',
            },
            required: true,
            description: 'avatar id',
          },
        ],
        responses: {
          200: {
            description: 'user avatar fetched',
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
      put: {
        tags: ['Todo CRUD operations'],
        description: 'Update todo',
        operationId: 'updateTodo',
        parameters: [
          {
            name: 'id',
            in: 'path',
            schema: {
              $ref: '#/components/schemas/id',
            },
            required: true,
            description: 'Id of todo to be updated',
          },
        ],
        responses: {
          200: {
            description: 'Todo updated successfully',
          },
          404: {
            description: 'Todo not found',
          },
          500: {
            description: 'Server error',
          },
        },
      },
      delete: {
        tags: ['Todo CRUD operations'],
        description: 'Deleting a todo',
        operationId: 'deleteTodo',
        parameters: [
          {
            name: 'id',
            in: 'path',
            schema: {
              $ref: '#/components/schemas/id',
            },
            required: true,
            description: 'Deleting a done todo',
          },
        ],
        responses: {
          200: {
            description: 'Todo deleted successfully',
          },
          404: {
            description: 'Todo not found',
          },
          500: {
            description: 'Server error',
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
  }
}
  
