export default function (obj: any, schema: any): boolean {
  for (const key in obj) {
    if (!schema[key] || typeof obj[key] !== schema[key]) {
      return false;
    }
  }
  return true;
}
