module.exports = {
  paths: {
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
  }
}