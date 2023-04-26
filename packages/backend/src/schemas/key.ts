export default {
  type: 'object',
  properties: {
    permissions: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['read', 'write', 'execute', 'start', 'stop', 'delete'],
      },
    },
    expires: {
      type: 'string',
      format: 'date-time',
    },
  },
  required: ["permissions"],
};
