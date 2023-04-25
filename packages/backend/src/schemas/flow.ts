export default {
  type: 'object',
  properties: {
    id: { type: 'string' },
    query: {
      type: 'object',
      properties: {
        syntax: { type: 'string' },
        vars: { type: 'array', items: { type: 'string' } },
      },
      required: ['syntax', 'vars'],
    },
    runAt: { anyOf: [{ type: 'string', format: 'date-time' }, { type: 'number' }] },
    createdAt: { type: 'number' },
    schedule: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['once', 'weekly', 'monthly'] },
        date: { type: 'string', format: 'date-time' },
        dayOfWeek: { type: 'string', enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
        dayOfMonth: { type: 'number', minimum: 1, maximum: 31 },
      },
      anyOf: [
        { required: ['type', 'date'] },
        { required: ['type', 'dayOfWeek'] },
        { required: ['type', 'dayOfMonth'] },
      ],
    },
    receiver: {
      type: 'object',
      properties: {
        identity: { type: 'string', enum: ['whatsapp', 'email', 'telegram', 'discord'] },
        address: { type: 'string' },
      },
      required: ['identity', 'address'],
    },
  },
  required: ['id', 'query', 'runAt', 'createdAt', 'schedule', 'receiver'],
};
