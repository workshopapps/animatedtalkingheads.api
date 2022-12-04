module.exports = {
    paths: {
      '/auth/signin': {
        post: {
          tags: ['Authentication'],
          description: 'create user account',
          operationId: 'createUserAccount',
          requestBody: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/UsersAuth',
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
                    $ref: '#/components/schemas/UsersAuth',
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
          requestBody: {
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/UsersAuth',
                  },
                },
              },
            },
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
                    $ref: '#/components/schemas/UsersAuth',
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
    }
  }
