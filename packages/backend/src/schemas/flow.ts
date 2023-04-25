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
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["daily", "weekly", "monthly"]
    },
    time: {
      type: "string",
      format: "time"
    },
    dayOfWeek: {
      type: "string"
    },
    dayOfMonth: {
      type: "integer",
      minimum: 1,
      maximum: 31
    }
  },
  required: ["type", "time"],
  dependencies: {
    type: {
      oneOf: [
        {
          properties: {
            type: {
              const: "weekly"
            },
            dayOfWeek: {
              type: "string"
            }
          },
          required: ["dayOfWeek"]
        },
        {
          properties: {
            type: {
              const: "monthly"
            },
            dayOfMonth: {
              type: "integer",
              minimum: 1,
              maximum: 31
            }
          },
          required: ["dayOfMonth"]
        }
      ]
    }
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
  required: ['query', 'schedule', 'receiver'],
};
