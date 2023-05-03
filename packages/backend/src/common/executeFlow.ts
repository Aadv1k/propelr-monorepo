import { Flow, Recipients } from "../types";

import runDracoQueryAndGetVar from "./runDracoQuery";

const i = {
  "data": {
    "d1": {
      "tag": "a",
      "attributes": {
        "href": "/news/articles/2023-05-02/fed-readies-to-pause-with-one-last-hike-decision-day-guide?srnd=premium-asia"
      },
      "children": [
        {
          "type": "TextNode",
          "text": "What to Watch as Fed Readies One Last Hike Before Pause"
        }
      ]
    },
    "d2": {
      "tag": "div",
      "attributes": {
        "class": "hover:underline focus:underline",
        "data-component": "related-item",
        "data-id": "RU17CGT0AFB401",
        "data-tracking-id": "RU17CGT0AFB401",
        "data-tracking-title": "Lede",
        "data-parent-id": "dec82e5f-8cc3-4793-89fe-00603a332d2d",
        "data-story-count": "3",
        "data-module-id": "dec82e5f-8cc3-4793-89fe-00603a332d2d"
      },
      "children": [
        {
          "tag": "a",
          "attributes": {
            "href": "/news/articles/2023-05-03/us-companies-add-296-000-jobs-beating-forecasts-adp-data-show",
            "data-component": "related-item-headline"
          },
          "children": [
            {
              "type": "TextNode",
              "text": "ADP Data Surprise With Biggest Private Payrolls Gain Since July"
            }
          ]
        },
        {
          "tag": "div",
          "attributes": {
            "class": "RecentTimestamp_wrapper_2-9-2-8RcZT",
            "data-component": "related-timestamp"
          },
          "children": [
            {
              "tag": "time",
              "attributes": {
                "class": "RelativeDate_relativeDate_2-9-2-R4FcK",
                "datetime": "2023-05-03T12:41:54.549Z",
                "data-locale": "en"
              },
              "children": []
            }
          ]
        }
      ]
    },
    "d3": {
      "tag": "a",
      "attributes": {
        "href": "/opinion/articles/2023-05-03/avoiding-stagflation-will-take-bravery-from-the-fed-and-ecb",
        "data-component": "related-item-headline"
      },
      "children": [
        {
          "type": "TextNode",
          "text": "Opinion: Avoiding Stagflation Will Take Brave Central Banks"
        }
      ]
    },
    "d4": {
      "tag": "a",
      "attributes": {
        "href": "/news/articles/2023-05-03/us-service-industry-expands-at-a-modest-pace-as-activity-cools",
        "data-component": "related-item-headline"
      },
      "children": [
        {
          "type": "TextNode",
          "text": "US Service Industry Expands at a Modest Pace as Activity Cools"
        }
      ]
    },
    "d5": {
      "tag": "img",
      "attributes": {
        "class": "ui-image",
        "data-component": "image",
        "src": "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/25x19.jpg",
        "srcset": "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/220x165.jpg 220w, https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/480x360.jpg 480w, https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/640x480.jpg 640w, https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/720x540.jpg 720w, https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/960x720.jpg 960w, https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/1020x765.jpg 1020w, https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/1200x900.jpg 1200w, https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/1280x960.jpg 1280w, https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/1400x1050.jpg 1400w, https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/1800x1350.jpg 1800w, https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/2000x1500.jpg 2000w",
        "sizes": "(min-width: 1px) and (max-width: 619px) 220px,\n                        (min-width: 620px) and (max-width: 759px) 480px,\n                        (min-width: 760px) and (max-width: 1019px) 640px, 1200px",
        "loading": "lazy",
        "alt": "Fed Chair Powell Holds News Conference Following FOMC Rate Decision"
      },
      "children": []
    },
    "d6": {
      "tag": "h3",
      "attributes": {
        "data-component": "title",
        "class": "styles_opinionTitle__JSYl6"
      },
      "children": [
        {
          "type": "TextNode",
          "text": "Bloomberg"
        }
      ]
    },
    "d7": {
      "tag": "a",
      "attributes": {
        "href": "/opinion/articles/2023-05-02/investing-in-china-don-t-bother-unless-you-re-chinese?srnd=premium-asia"
      },
      "children": [
        {
          "type": "TextNode",
          "text": "Don’t Bother Investing in China Unless You’re Chinese"
        }
      ]
    },
    "d8": {
      "tag": "a",
      "attributes": {
        "href": "/opinion/articles/2023-05-02/china-economy-the-rebound-is-starting-to-look-tired?srnd=premium-asia"
      },
      "children": [
        {
          "type": "TextNode",
          "text": "This Chinese Rebound Is Already Starting to Look Tired"
        }
      ]
    },
    "d9": {
      "tag": "a",
      "attributes": {
        "href": "/opinion/articles/2023-05-02/chatgpt-is-the-start-of-online-education-for-chegg-not-the-end?srnd=premium-asia"
      },
      "children": [
        {
          "type": "TextNode",
          "text": "ChatGPT Is the Start of Online Education, Not the End"
        }
      ]
    },
    "d10": {
      "tag": "a",
      "attributes": {
        "href": "/opinion/articles/2023-05-02/lithium-investors-need-not-fear-a-government-takeover?srnd=premium-asia"
      },
      "children": [
        {
          "type": "TextNode",
          "text": "Lithium Investors Need Not Fear a Government Takeover"
        }
      ]
    },
    "d11": {
      "tag": "a",
      "attributes": {
        "href": "/opinion/articles/2023-05-02/ai-godfather-geoffrey-hinton-should-have-spoken-up-sooner?srnd=premium-asia"
      },
      "children": [
        {
          "type": "TextNode",
          "text": "AI’s ‘Godfather’ Should Have Spoken Up Sooner"
        }
      ]
    }
  },
  "message": "Parsed query in 94ms",
  "vars": [
    {
      "type": "JSON",
      "value": {
        "tag": "a",
        "attributes": {
          "href": "/news/articles/2023-05-02/fed-readies-to-pause-with-one-last-hike-decision-day-guide?srnd=premium-asia"
        },
        "children": [
          {
            "type": "TextNode",
            "text": "What to Watch as Fed Readies One Last Hike Before Pause"
          }
        ]
      }
    },
    {
      "type": "JSON",
      "value": {
        "tag": "div",
        "attributes": {
          "class": "hover:underline focus:underline",
          "data-component": "related-item",
          "data-id": "RU17CGT0AFB401",
          "data-tracking-id": "RU17CGT0AFB401",
          "data-tracking-title": "Lede",
          "data-parent-id": "dec82e5f-8cc3-4793-89fe-00603a332d2d",
          "data-story-count": "3",
          "data-module-id": "dec82e5f-8cc3-4793-89fe-00603a332d2d"
        },
        "children": [
          {
            "tag": "a",
            "attributes": {
              "href": "/news/articles/2023-05-03/us-companies-add-296-000-jobs-beating-forecasts-adp-data-show",
              "data-component": "related-item-headline"
            },
            "children": [
              {
                "type": "TextNode",
                "text": "ADP Data Surprise With Biggest Private Payrolls Gain Since July"
              }
            ]
          },
          {
            "tag": "div",
            "attributes": {
              "class": "RecentTimestamp_wrapper_2-9-2-8RcZT",
              "data-component": "related-timestamp"
            },
            "children": [
              {
                "tag": "time",
                "attributes": {
                  "class": "RelativeDate_relativeDate_2-9-2-R4FcK",
                  "datetime": "2023-05-03T12:41:54.549Z",
                  "data-locale": "en"
                },
                "children": []
              }
            ]
          }
        ]
      }
    },
    {
      "type": "JSON",
      "value": {
        "tag": "a",
        "attributes": {
          "href": "/opinion/articles/2023-05-03/avoiding-stagflation-will-take-bravery-from-the-fed-and-ecb",
          "data-component": "related-item-headline"
        },
        "children": [
          {
            "type": "TextNode",
            "text": "Opinion: Avoiding Stagflation Will Take Brave Central Banks"
          }
        ]
      }
    },
    {
      "type": "JSON",
      "value": {
        "tag": "a",
        "attributes": {
          "href": "/news/articles/2023-05-03/us-service-industry-expands-at-a-modest-pace-as-activity-cools",
          "data-component": "related-item-headline"
        },
        "children": [
          {
            "type": "TextNode",
            "text": "US Service Industry Expands at a Modest Pace as Activity Cools"
          }
        ]
      }
    },
    {
      "type": "JSON",
      "value": {
        "tag": "img",
        "attributes": {
          "class": "ui-image",
          "data-component": "image",
          "src": "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/25x19.jpg",
          "srcset": "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/220x165.jpg 220w, https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/480x360.jpg 480w, https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/640x480.jpg 640w, https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/720x540.jpg 720w, https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/960x720.jpg 960w, https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/1020x765.jpg 1020w, https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/1200x900.jpg 1200w, https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/1280x960.jpg 1280w, https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/1400x1050.jpg 1400w, https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/1800x1350.jpg 1800w, https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i50CJNyn4wzQ/v8/2000x1500.jpg 2000w",
          "sizes": "(min-width: 1px) and (max-width: 619px) 220px,\n                        (min-width: 620px) and (max-width: 759px) 480px,\n                        (min-width: 760px) and (max-width: 1019px) 640px, 1200px",
          "loading": "lazy",
          "alt": "Fed Chair Powell Holds News Conference Following FOMC Rate Decision"
        },
        "children": []
      }
    },
    {
      "type": "JSON",
      "value": {
        "tag": "h3",
        "attributes": {
          "data-component": "title",
          "class": "styles_opinionTitle__JSYl6"
        },
        "children": [
          {
            "type": "TextNode",
            "text": "Bloomberg"
          }
        ]
      }
    },
    {
      "type": "JSON",
      "value": {
        "tag": "a",
        "attributes": {
          "href": "/opinion/articles/2023-05-02/investing-in-china-don-t-bother-unless-you-re-chinese?srnd=premium-asia"
        },
        "children": [
          {
            "type": "TextNode",
            "text": "Don’t Bother Investing in China Unless You’re Chinese"
          }
        ]
      }
    },
    {
      "type": "JSON",
      "value": {
        "tag": "a",
        "attributes": {
          "href": "/opinion/articles/2023-05-02/china-economy-the-rebound-is-starting-to-look-tired?srnd=premium-asia"
        },
        "children": [
          {
            "type": "TextNode",
            "text": "This Chinese Rebound Is Already Starting to Look Tired"
          }
        ]
      }
    },
    {
      "type": "JSON",
      "value": {
        "tag": "a",
        "attributes": {
          "href": "/opinion/articles/2023-05-02/chatgpt-is-the-start-of-online-education-for-chegg-not-the-end?srnd=premium-asia"
        },
        "children": [
          {
            "type": "TextNode",
            "text": "ChatGPT Is the Start of Online Education, Not the End"
          }
        ]
      }
    },
    {
      "type": "JSON",
      "value": {
        "tag": "a",
        "attributes": {
          "href": "/opinion/articles/2023-05-02/lithium-investors-need-not-fear-a-government-takeover?srnd=premium-asia"
        },
        "children": [
          {
            "type": "TextNode",
            "text": "Lithium Investors Need Not Fear a Government Takeover"
          }
        ]
      }
    },
    {
      "type": "JSON",
      "value": {
        "tag": "a",
        "attributes": {
          "href": "/opinion/articles/2023-05-02/ai-godfather-geoffrey-hinton-should-have-spoken-up-sooner?srnd=premium-asia"
        },
        "children": [
          {
            "type": "TextNode",
            "text": "AI’s ‘Godfather’ Should Have Spoken Up Sooner"
          }
        ]
      }
    }
  ],
  "status": 200
}

function formatMessageFromHTMLObject(obj: any): string {
  let links: Array<string> = [],
    text: Array<string> = [],
    image: Array<string> = [];

    for (const key in obj) {
      const target = obj[key];
      switch (target.tag) {
        case "a":
          links.push(obj[key].attributes.href);
          break;
        case "img":
          image.push(obj[key].attributes.src);
          break;
        case "h3":
        case "h2":
        case "h1":
        case "h4":
        case "h5":
        case "h6":
          text.push(obj[key].children[0].text);
          break;
        case "p":
          text.push(obj[key].children[0].text);
          break;
      }
    }

    const pad = "=".repeat(16);
    let out = `${pad}TEXT${pad}\n${text.join("\n")}\n\n${pad}LINKS${pad}\n${links.join("\n")}\n\n${pad}IMAGES${pad}\n${image.join("\n")}\n\n`

    return out;
}

export default async function(flow: Flow) {
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

  const message = formatMessageFromHTMLObject(parsedVars);

  switch (flow.receiver.identity) {
    case Recipients.whatsapp: 
      break;
    case Recipients.email: 
      break;
  }
}
