import { GET } from './http';

export default async function (email: string, isProd?: boolean, key?: string): Promise<boolean> {
  const EMAIL_REG = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const ABSTRACT_URL = `https://emailvalidation.abstractapi.com/v1/?api_key=${key}`;

  if (!email.match(EMAIL_REG)) {
    return false;
  }

  // we don't waste our calls on dev
  if (isProd) {
    const url = `${ABSTRACT_URL}&email=${email}`;

    let data: Array<Buffer>;
    let parsed: any;

    try {
      data = await GET(url);
      parsed = JSON.parse(data.toString());
    } catch {
      return false;
    }
    if (parsed?.deliverability !== 'DELIVERABLE') return false;
  }

  return true;
}
