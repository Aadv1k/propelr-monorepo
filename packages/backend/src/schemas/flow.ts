export default {
  type: 'object',
  properties: {
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
        type: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'none'] },
        time: { type: 'string' },
        dayOfWeek: { type: 'integer', minimum: 1, maximum: 7 },
        dayOfMonth: { type: 'integer', minimum: 1, maximum: 31 },
      },
      required: ['type', 'time'],
      oneOf: [
        {
          properties: { type: { const: 'daily' } },
          required: ['type'],
        },
        {
          properties: {
            type: { const: 'weekly' },
            dayOfWeek: { type: 'integer', minimum: 1, maximum: 7 },
          },
          required: ['type', 'dayOfWeek'],
        },
        {
          properties: {
            type: { const: 'monthly' },
            dayOfMonth: { type: 'integer', minimum: 1, maximum: 31 },
          },
          required: ['type', 'dayOfMonth'],
        },
        {
          properties: {
            type: { const: 'none' },
          },
          required: ['type'],
        },

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

  required: ["query", "schedule", "receiver"],
};
