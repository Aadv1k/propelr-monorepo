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
    schedule: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['daily', 'weekly', 'monthly'] },
        time: { type: 'string' },
        dayOfWeek: { type: 'integer', maximum: 7 },
        dayOfMonth: { type: 'integer', maximum: 31 },
      },
      required: ['type', 'time'],
      dependencies: {
        type: {
          oneOf: [
            {
              properties: { type: { const: 'daily' } },
              required: ['type', 'time'],
            },
            {
              properties: { type: { const: 'weekly' }, dayOfWeek: { type: 'integer' } },
              required: ['type', 'time', 'dayOfWeek'],
            },
            {
              properties: { type: { const: 'monthly' }, dayOfMonth: { type: 'integer' } },
              required: ['type', 'time', 'dayOfMonth'],
            },
          ],
        },
      },
    },
    required: ['query', 'schedule', 'receiver'],
  },
};
