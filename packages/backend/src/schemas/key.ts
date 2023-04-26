export default {
  type: 'object',
  properties: {
    permissions: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['read', 'write'],
      },
    },
    expires: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ['permissions', 'expires'],
};
