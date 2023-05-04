import { Flow, Recipients } from '../types';

import runDracoQueryAndGetVar from './runDracoQuery';
import sendMail from './Mailer';

function formatMessageFromHTMLObject(obj: any): [string, string] {
  let links: Array<string> = [],
    text: Array<string> = [],
    image: Array<string> = [];

  for (const item of obj) {
    const target = item.value;
    switch (target.tag) {
      case 'a':
        links.push(target.attributes.href);
        break;
      case 'img':
        image.push(obj[item].attributes.src);
        break;
      case 'h3':
      case 'h2':
      case 'h1':
      case 'h4':
      case 'h5':
      case 'h6':
        text.push(obj[item].children[0].text);
        break;
      case 'p':
        text.push(obj[item].children[0].text);
        break;
    }
  }

  const pad = '='.repeat(16);

  const textBlob = `${pad}TEXT${pad}\n`;
  const linkBlob = `${pad}LINKS${pad}\n`;
  const imageBlob = `${pad}IMAGES${pad}\n`;

  let out = `${textBlob}\n${text.join('\n')}\n${linkBlob}\n${links.join(
    '\n',
  )}\n${imageBlob}\n${image.join('\n')}\n\n`;

  let outHtml = `
    ${
      text.length !== 0
        ? `<h2>TEXT</h2>
        ${text.map((e) => `<p>${e}</p>`).join('\n')}
      <br> 
  `
        : ''
    }

    ${
      links.length !== 0
        ? `<h2>LINKS</h2>
        ${links.map((e) => `<p>${e}</p>`).join('\n')}
      <br>
  `
        : ''
    }

    ${
      image.length !== 0
        ? `<h2>IMAGES</h2>
        ${image.map((e) => `<p>${e}</p>`).join('\n')}
      <br>
  `
        : ''
    }
  `;

  return [out, outHtml];
}

export default async function executeFlow(flow: Flow) {
  const dracoSyntax = flow.query.syntax;
  const dracoVars = flow.query.vars;
  let parsedVars;

  try {
    parsedVars = await runDracoQueryAndGetVar(dracoSyntax, dracoVars);
  } catch (err) {
    return null;
  }

  let ret: any = {};
  for (let i = 0; i < dracoVars.length; i++) {
    ret[dracoVars[i]] = parsedVars?.[i];
  }

  const [message, htmlMessage] = formatMessageFromHTMLObject(parsedVars);

  switch (flow.receiver.identity) {
    case Recipients.whatsapp:
      break;
    case Recipients.email:
      console.log('hello');
      const mailSent = await sendMail({
        to: flow.receiver.address,
        subject: 'TEST',
        html: htmlMessage,
      });
      console.log(`[INFO] Sent mail ${mailSent}`);
      break;
  }
}
