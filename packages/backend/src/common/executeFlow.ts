import { Flow, Recipients } from '../types';

import { node as common } from '@propelr/common';
import sendMail from './sendMail';

function recursiveHtmlParser(obj: any) {
		let items: any = {
				links: [],
				images: [],
				texts: [],
		} 

		let target = obj;

   		

    switch (obj?.tag) {
      case 'a':
        items.links.push(target.attributes.href);
        break;
      case 'img':
        items.images.push(target.attributes.src);
        break;
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        items.texts.push(target.children[0].text);
        break;
      case 'b':
      case 'i':
      case 'em':
      case 'strong':
      case 'p':
						items.texts.push(target.children[0].text);
						break;
				case 'div':
				case 'article':
				case 'section':
				case 'main':
				case 'aside':
						const ret = target.children.forEach(e => {
								let ret = recursiveHtmlParser(e);
								items.texts.push(...ret.texts)
								items.images.push(...ret.images)
								items.links.push(...ret.links)
						});
						break;
    }

		return items;
}


function formatMessageFromHTMLObject(obj: any): [string, string] {
		let parsedItems = recursiveHtmlParser(obj[0].value);

		let itemList = Object.keys(parsedItems).filter(e => parsedItems[e].length > 0);
		const outHtml = itemList.map((e: string) => {
				return `<center><h2>${e.toUpperCase()}</h2></center>\n<ul>` + parsedItems[e].map((it: any) => `<li>${it}</li>`).join("\n") + "</ul><br>";
		}).join("<hr>")

		const out = Object.keys(parsedItems).map((e: string) => {
				return `${e.toUpperCase()}\n` + parsedItems[e].map((it: any) => `${it}`).join("\n");
		}).join("\n\n")


  return [out, outHtml];
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

  const [message, htmlMessage] = formatMessageFromHTMLObject(parsedVars);

  switch (flow.receiver.identity) {
    case Recipients.whatsapp:
      break;
    case Recipients.email:
      const mailSent = await sendMail({
        to: flow.receiver.address,
        subject: `propelr job: ${flow.id}`,
        html: htmlMessage,
      });
      break;
  }
}
