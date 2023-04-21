import { Errors } from "../types/const";
import dotenv from "dotenv"

dotenv.config({
  path: "../../"
});

export const PORT = 3000;

export const isProd = process.env?.NODE_ENV === "production" ? true : false;
export const ABSTRACT_API = {
  KEY: process.env.ABSTRACT_API_KEY ?? "",
}

export const ERROR: Errors = {
  invalidMime: {
    code: "invalid-mime",
    message: "Invalid MIME type",
    details: "The provided MIME type is not valid. Please provide a valid MIME type in the request",
    status: 400,
  },

  invalidJSON: {
    code: "invalid-JSON",
    message: "Invalid JSON",
    details: "expected valid JSON for the path",
    status: 400,
  },

  badRequest: {
    code: "bad-request",
    message: "Received a bad request",
    details: "expected a particular data format recieved something else",
    status: 400,
  },

  emailInvalid: {
    code: "email-invalid",
    message: "Received a bad email",
    details: "the received email was either syntactically invalid or didn't exist",
    status: 400,
  }
}
