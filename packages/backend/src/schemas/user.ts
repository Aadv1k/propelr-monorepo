export default {
  type: "object",
  properties: {
    email: { type: "string", format: "email", maxLength: 255 },
    password: { type: "string", maxLength: 255 }
  },
  required: ["email", "password"],
  additionalProperties: false
};

