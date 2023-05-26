import { Flow, Recipients } from '../types';

import { node as common } from '@propelr/common';
import sendMail from './sendMail';

function parseData(data) {
  const categorized = {
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


function generateHTML(data) {
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

  const generatedHTML = generateHTML(parseData(parsedVars));

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
