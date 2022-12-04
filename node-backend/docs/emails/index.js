module.exports = {
  paths: {
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
  },
};
