module.exports = {
  // paths: {
  //   '/todos': {
  //     get: {
  //       tags: ['Todos'],
  //       description: 'Get todos',
  //       operationId: 'getTodos',
  //       parameters: [],
  //       responses: {
  //         200: {
  //           description: 'Todos were obtained',
  //           content: {
  //             'application/json': {
  //               schema: {
  //                 $ref: '#/components/schemas/Todo',
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //     post: {
  //       tags: ['Todo CRUD operations'],
  //       description: 'Create todo',
  //       operationId: 'createTodo',
  //       parameters: [],
  //       requestBody: {
  //         content: {
  //           'application/json': {
  //             schema: {
  //               $ref: '#/components/schemas/TodoInput',
  //             },
  //           },
  //         },
  //       },
  //       responses: {
  //         201: {
  //           description: 'Todo created successfully',
  //         },
  //         500: {
  //           description: 'Server error',
  //         },
  //       },
  //     },
  //   },
  //   '/todos/{id}': {
  //     get: {
  //       tags: ['Foods CRUD operations'],
  //       description: 'Get a todo',
  //       operationId: 'getTodo',
  //       parameters: [
  //         {
  //           name: 'id',
  //           in: 'path',
  //           schema: {
  //             $ref: '#/components/schemas/id',
  //           },
  //           required: true,
  //           description: 'A single todo id',
  //         },
  //       ],
  //       responses: {
  //         200: {
  //           description: 'Todo is obtained',
  //           content: {
  //             'application/json': {
  //               schema: {
  //                 $ref: '#/components/schemas/Todo',
  //               },
  //             },
  //           },
  //         },
  //         404: {
  //           description: 'Todo is not found',
  //           content: {
  //             'application/json': {
  //               schema: {
  //                 $ref: '#/components/schemas/Error',
  //                 example: {
  //                   message: "We can't find the todo",
  //                   internal_code: 'Invalid id',
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //     put: {
  //       tags: ['Todo CRUD operations'],
  //       description: 'Update todo',
  //       operationId: 'updateTodo',
  //       parameters: [
  //         {
  //           name: 'id',
  //           in: 'path',
  //           schema: {
  //             $ref: '#/components/schemas/id',
  //           },
  //           required: true,
  //           description: 'Id of todo to be updated',
  //         },
  //       ],
  //       responses: {
  //         200: {
  //           description: 'Todo updated successfully',
  //         },
  //         404: {
  //           description: 'Todo not found',
  //         },
  //         500: {
  //           description: 'Server error',
  //         },
  //       },
  //     },
  //     delete: {
  //       tags: ['Todo CRUD operations'],
  //       description: 'Deleting a todo',
  //       operationId: 'deleteTodo',
  //       parameters: [
  //         {
  //           name: 'id',
  //           in: 'path',
  //           schema: {
  //             $ref: '#/components/schemas/id',
  //           },
  //           required: true,
  //           description: 'Deleting a done todo',
  //         },
  //       ],
  //       responses: {
  //         200: {
  //           description: 'Todo deleted successfully',
  //         },
  //         404: {
  //           description: 'Todo not found',
  //         },
  //         500: {
  //           description: 'Server error',
  //         },
  //       },
  //     },
  //   },
  // },
};
