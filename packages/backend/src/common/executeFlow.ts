import { Flow, Recipients } from "../types";

import runDracoQueryAndGetVar from "./runDracoQuery";


function extractTextFromDeepObject(obj: any): {
  [key: string]: [val: string]
} {
  let txts: {
    [key: string]: [val: string]
  } = {};

  for (const item in obj) {
    if (typeof (obj[item]) === "string") {
      let key = item;
      let i = 0;

      if (txts[key]) {
        key = item + i
        i++;
      }

      txts[key] = obj[item];
    } else {
      txts = { ...txts, ...extractTextFromDeepObject(obj[item]) };
    }
  }
  return txts;
}

export default async function(flow: Flow) {
  const dracoSyntax = flow.query.syntax;
  const dracoVars = flow.query.vars;

  try {
    parsedVars = await runDracoQueryAndGetVar(dracoSyntax, dracoVars);
  } catch (err) {
    return null;
  }

  let normalizedVars: Array<string> = parsedVars.map(e: any => {
    if (e.type === "JSON") {
      return [e, extractTextFromDeepObject(e.value)];
    }
    return [e, e.value];
  })

  console.log(parsedVars);

  switch (flow.receiver.identity) {
    case Recipients.whatsapp: 
      break;
    case Recipients.email: 
      break;
  }
}
