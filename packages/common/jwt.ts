import crypto from 'node:crypto';

function hmac256(txt: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(txt).digest('hex');
}

const HEADER = {
  alg: 'HS256',
  typ: 'JWT',
};

function b64Encode(text: string): string {
  return Buffer.from(text)
    .toString('base64')
    .replace(/=/g, "")

}

function b64Decode(text: string): string {
  return Buffer.from(text, 'base64').toString();
}

export function sign(obj: any, secret: string) {
  const head = b64Encode(JSON.stringify(HEADER));
  const payload = b64Encode(JSON.stringify(obj));
  const tail = hmac256(`${head}.${payload}`, secret);

  return `${head}.${payload}.${tail}`;
}

export function parse(token: string): any {
  let payload;
  try {
    payload = token.split('.')[1];
  } catch (err) {
    return null;
  }
  return JSON.parse(b64Decode(payload));
}

export function verify(token: string, secret: string): boolean {
    const split = token.split('.');

    if (split.length !== 3) return false;

    const head = b64Decode(split[0]);
    const payload = b64Decode(split[1]);
    const tail = split[2];

    if (JSON.parse(head).alg !== HEADER.alg) return false;

    const decoded = hmac256(`${b64Encode(head)}.${b64Encode(payload)}`, secret);

    if (decoded !== tail) return false;

    return true;
}


