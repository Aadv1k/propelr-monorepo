import { isProd, ABSTRACT } from "./const";
import { GET } from "./fetch";

const EMAIL_REG = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const ABSTRACT_URL = `https://emailvalidation.abstractapi.com/v1/?api_key=${ABSTRACT.KEY}`;

export default async function (email: string, isProd?: boolean): Promise<boolean> {
  if (!email.match(EMAIL_REG)) { return false; }

  // we don't waste our calls on dev
  if (isProd) {
    let url = `${ABSTRACT_URL}&email=${email}`;

    let data: Array<Buffer>;
    let parsed: any;

    try {
      data = await GET(url);
      parsed = JSON.parse(data.toString());
    } catch {
      return false;
    }
    if (parsed?.deliverability !== "DELIVERABLE") return false;
  }

  return true;
}
