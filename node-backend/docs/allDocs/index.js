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
        description: 'Animate a podcast',
        operationId: 'AnimatedPodcast',
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
        operationId: 'GenerateVideo',
        parameters: [
          {
            in: 'path',
            name: 'podcastID',
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
            description: 'ID of the user to use, placed  in the headers',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  audio_path: {
                    type: 'string',
                    required: true,
                  },
                  audio_url: {
                    type: 'string',
                    required: true,
                  },
                  bg_path: {
                    type: 'string',
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
     '/paystack/pay': {
      post: {
        tags: ['Payment'],
        description: 'pay with paystack',
        operationId: 'paystack pay',

        requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Payment',
                },
              },
            },
          },
        responses: {
          201: {
            description: 'redirecting to paystack',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    }, 
          '/auth/signup': {
        post: {
          tags: ['Authentication'],
          description: 'create user account',
          operationId: 'createUserAccount',
          requestBody: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Authentication',
                  },
                },
              },
            },
          responses: {
            201: {
              description: 'User account Created Successfully',
            },
            500: {
              description: 'Server error',
            },
          },
        },
      },

      '/auth/forgetpassword': {
        post: {
          tags: ['Authentication'],
          description: 'Clear user password',
          operationId: 'clearUserPassword',
          requestBody: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Authentication',
                  },
                },
              },
            },
          responses: {
            201: {
              description: 'password cleared successfully',
            },
            500: {
              description: 'Server error',
            },
          },
        },
      },

      '/auth/logout': {
        get: {
          tags: ['Authentication'],
          description: 'Log out user',
          operationId: 'logOutUser',
          parameters: [
          {
              schema: {
                  $ref: '#/components/schemas/Authentication',
              },
          }],
          responses: {
            201: {
              description: 'Logged out Successfully',
            },
            500: {
              description: 'Server error',
            },
          },
        },
      },

      '/auth/login': {
        post: {
          tags: ['Authentication'],
          description: 'Log in user',
          operationId: 'logInUser',
          requestBody: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Authentication',
                  },
                },
              },
            },
          responses: {
            201: {
              description: 'User logged in Successfully',
            },
            500: {
              description: 'Server error',
            },
          },
        },
      },
       '/rauth/forgotpassword': {
      post: {
        tags: ['Password'],
        description: 'forget password',
        operationId: 'forgetPassword',
        requestBody: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Password',
                },
              },
            },
          },
        responses: {
          200: {
            description: 'sent successfuly',
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
    
      '/avatars': {
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
                      _id: '8gfg8iu89ikjgi5',
                      user_id: 'kdf84ur8uf485u8u',
                      file_path: 'filepath/podcast_id/filepathname',
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


  },
};
