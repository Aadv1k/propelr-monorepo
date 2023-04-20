import https from "node:https";
import http from "node:http";

export function GET(target: string): Promise<Array<Buffer>> {
  const url = new URL(target);
  return new Promise((resolve, reject) => {
    (url.protocol === "http:" ? http : https)
      .get(url.href, (res) => {
      let data: Array<Buffer> = [];
      res.on("data", (d: Buffer) => data.push(d));
      res.on("end", () => resolve(data));
      res.on("error", (error) => reject(error));
    })
  })
}
