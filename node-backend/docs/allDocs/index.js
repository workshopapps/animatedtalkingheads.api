module.exports = {
  paths: {
    '/podcasts': {
      get: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ['Podcast'],
        description: 'get all podcast a user has ever uploaded',
        operationId: 'getAllPodcast',
        
        responses: {
          200: {
            description: 'Returns an array of all user podcasts',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/podcasts/upload': {
      post: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ['Podcast'],
        description: 'Upload a podcast',
        operationId: 'uploadPodcast',
        // parameters: [
        //   {
        //     in: 'header',
        //     name: 'user_id',
        //     schema: {
        //       type: 'string',
        //     },
        //     required: true,
        //     description: 'ID of the user to use, put in headers',
        //   },
        // ],
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
                file_name: {
                      type: 'string',
                      example: 'My podcast on Donald trump',
                      description:
                          'The podcast name that would be displayed on the dashboard',
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
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ['AnimatedVideo'],
        description: 'Get an animated video',
        operationId: 'AnimatedPodcast',
        parameters: [
          {
            in: 'path',
            name: 'animatedVideoId',
            schema: {
              type: 'string',
            },
            required: true,
            description:
              'ID of the animated video you want to view its progress ',
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

        description: 'view all animated videos ever created by a user',
        operationId: 'ViewAllAnimatedVideo',
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
            description: 'Animated Video created successfully',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/podcasts/{podcastID}/generate-video': {
      post: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ['Podcast', 'AnimatedVideo'],
        description: 'Generate an animated video',
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
          // {
          //   in: 'header',
          //   name: 'user_id',
          //   schema: {
          //     type: 'string',
          //   },
          //   required: true,
          //   description: 'ID of the user to use, placed  in the headers',
          // },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  bg_path: {
                    type: 'string',
                    example: '01',
                    description: 'background image, Use `01` for now',
                  },
                  avatar_map: {
                    type: 'object',
                    properties: {
                      A: {
                        type: 'string',
                        example: '03',
                        description:
                          'id for the avatar you want to use. Use `01` for now',
                      },
                      B: {
                        type: 'string',
                        example: '01',
                        description:
                          'id for the avatar you want to use. Use `02` for now',
                      },
                    },
                    description: 'map of the avatar object',
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
    '/settings/add': {
      post: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ['UserSettings'],
        description: 'Store user preferred settings',
        operationId: 'usersettings',

        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserSettings',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User settings object returned back',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/settings/get': {
      get: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ['UserSettings'],
        description: 'Get user preferred settings',
        operationId: 'usersettingsget',

        responses: {
          200: {
            description: 'User settings object returned back',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/subscription': {
      get: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        tags: ['Payment'],
        description: 'Get a user payment',
        operationId: 'specificuserpaymentget',

        responses: {
          200: {
            description: 'An Array of User payments object returned back',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/getpayments': {
      get: {
        tags: ['Payment'],
        description: 'Get paid users For Dev Purpose',
        operationId: 'userpaymentget',

        responses: {
          200: {
            description: 'User payments object returned back',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/paystack/pay': {
      post: {
        security: [
          {
            bearerAuth: [],
          },
        ],
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
          },
        ],
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

    '/resetpassword/{:token}': {
      patch: {
        tags: ['Reset'],
        description: 'Reset Password',
        operationId: 'ResetPassword',
        parameters: [
          {
            token: 'token',
            in: 'newPassword',
            schema: {
              $ref: '#/components/schemas/token',
            },
            required: true,
            description: 'New password',
          },
        ],
        responses: {
          200: {
            description: 'Password reset successfully',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },

    '/rauth/contact': {
      post: {
        tags: ['Contact'],
        description: 'contact us',
        operationId: 'contantUs',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Contact',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Successfuly contacted',
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
