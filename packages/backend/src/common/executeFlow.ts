import { Flow, Recipients } from '../types';

import { node as common } from '@propelr/common';
import sendMail from './sendMail';

import { writeFileSync } from "node:fs";

interface ParsedData {
  links: string[];
  text: string[];
  images: string[];
}

interface JSONData {
  type: 'JSON';
  value: {
    tag: string;
    attributes: {
      href?: string;
      src?: string;
    };
    children: {
      type: 'TextNode';
      text?: string;
    }[];
  };
}

function parseData(data: JSONData[]): ParsedData {
  let categorized: ParsedData = {
    links: [],
    text: [],
    images: [],
  };

  for (const item of data) {
    if (item.type === 'JSON' && item.value) {
      const { tag, attributes, children } = item.value;

      if (tag === 'a' && attributes.href) {
        categorized.links.push(attributes.href);
      } else if (tag === 'img' && attributes.src) {
        categorized.images.push(attributes.src);
      }

      for (const child of children) {
        if (child.type === 'TextNode' && child.text) {
          categorized.text.push(child.text);
        }
      }
    }
  }

  return categorized;
}

function generateHTML(data: any): any {
  let html = '';

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const items = data[key];
      if (items && items.length > 0) {
        html += `<h2>${key.toUpperCase()}</h2>`;
        html += '<ul>';

        for (const item of items) {
          if (key === 'images') {
            html += `<li><img src="${item}"></li>`;
          } else if (key === 'links') {
            html += `<li><a href="${item}">${item}</a></li>`;
          } else if (key === 'text') {
            html += `<li>${item}</li>`;
          }
        }

        html += '</ul>';
      }
    }
  }

  return html;
}



export default async function executeFlow(flow: Flow) {
  const dracoSyntax = flow.query.syntax;
  const dracoVars = flow.query.vars;
  let parsedVars;

  try {
    parsedVars = await common.dracoQueryRunner.runDracoQueryAndGetVar(dracoSyntax, dracoVars);
  } catch (err) {
    throw err;
  }

  const parsedData = parseData(parsedVars as any);
  let generatedHTML = generateHTML(parsedData);


  if (generatedHTML.length === 0) {
      generatedHTML = "<h2>Your data was too complex :/</h2><p>We suggest you try being more specific when selecting element from prevent this from happening. You can delete this flow and create a new one</p>"
  }

  switch (flow.receiver.identity) {
    case Recipients.whatsapp:
      break;
    case Recipients.email:
      const mailSent = await sendMail({
        to: flow.receiver.address,
        subject: `propelr job: ${flow.id}`,
        html: generatedHTML,
      });
      break;
  }
}
