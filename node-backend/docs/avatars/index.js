module.exports = {
  paths: {
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
  }
}
  
  