import { useContext, useState, useEffect, useRef } from 'react';
import UserContext from '../context/UserContext';
import unique from 'unique-selector';

import { Link as RouterLink, useNavigate} from 'react-router-dom';

import {
  Input,
  Text,
  Spinner,
  ButtonGroup,
  Button,
  FormHelperText,
  FormErrorMessage,
  FormLabel,
  InputLeftAddon,
  InputRightAddon,
  InputGroup,
  Heading,
  VStack,
  FormControl,
  Card,
  CardBody,
  Flex,
  Box,
} from '@chakra-ui/react';

const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

function AskForURL({url, setUrl}: {url: string, setUrl: any}): any {
  const [error, setError] = useState(false);


  const handleChange = (e: any) => {
    const targetUrl = e.target.value;


    if (!targetUrl.match(URL_REGEX)) {
      setError(true);
      return;
    }
    setError(false);
  }


  const handleSubmit = (e: any) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const targetUrl: string = form.get("url") as string;
    setUrl(targetUrl);
  }

  return (
    <Flex minH="100vh" w="100%" alignItems="center" justifyContent="center" flexDirection="column" gap={6}>

      <RouterLink to="/dashboard">
        <Button as="a" size="lg" position="absolute" top={4} left={4} alignSelf="flex-end" variant="link">
          <i className="bi bi-arrow-left" style={{ fontSize: '3rem' }}></i>
        </Button>
      </RouterLink>

      <VStack maxW={700} w="80%" gap={2} alignItems="left">
        <Heading textAlign="left" fontWeight={800} color="gray.700">Let's Start!</Heading>
        <Text textAlign="left" color="gray.600">
        First, enter a URL. We will fetch the HTML for you, this process isn't perfect and markup may differ from the browser
        </Text>
      </VStack>

      <Box bg="white.200" shadow="none" w="80%" maxW={700} h="auto">
        <Flex as="form" onSubmit={handleSubmit} flexDirection="column" gap={4} w="full">

          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input onChange={handleChange} required name="url" placeholder="enter a valid url..." />
            {error && <FormHelperText color="red.500" textAlign="left">Invalid URL, please check again</FormHelperText>}
          </FormControl>

          <Button
            size="lg"
            type="submit"
            isDisabled={error}
            alignSelf="flex-end"
            variant="solid"
            rightIcon={<i className="bi bi-arrow-right"></i>}
          >
            Go
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}

function getSelectorForElement(el: any) {
  const selectorParts = [];
  while (el && el.tagName !== "BODY") {
    const index = Array.from(el.parentNode.children).indexOf(el) + 1;
    const tag = el.tagName.toLowerCase();
    selectorParts.unshift(`${tag}:nth-child(${index})`);
    el = el.parentNode;
  }
  return selectorParts.join(" > ");
}


function BrowserPane({url}: {url: string}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [html, setHtml] = useState("");

  const paneRef = useRef(null);

  const reFetchHtml = () => {
    setLoading(true);

    fetch(`http://localhost:4000/api/scraper?url=${encodeURIComponent(url)}`)
      .then(res => res.json())
      .then(data => {
        if (data.status !== 200) {
          setError(true);
        }  else {
          setHtml(data.data.content);
        }
        setLoading(false)
      })

  }

  const handlePaneClick = (e: any) => {
    e.preventDefault();
    let target = paneRef.current as any;

    const selector = unique(e.target);
    let doc = document.querySelector(`${selector}`) as any;
    console.log(doc);
    doc.style.outline = "10px solid red";

    //target.querySelector().style = {};
  }


  useEffect(() => {

    fetch(`http://localhost:4000/api/scraper?url=${encodeURIComponent(url)}`)
    .then(res => res.json())
    .then(data => {
      if (data.status !== 200) {
        setError(true);
      }  else {
        setHtml(data.data.content);
      }
      setLoading(false)
    })

  }, [])

  return (

    <Box w="80%" maxW={900} h="100vh" overflow="scroll" border="1px solid black">

      <Flex w="full" gap={4} h={20} overflow="hidden" borderBottom="1px solid black" bg="gray.200" py={4} px={2} alignItems="center" justifyContent="space-between">
      <Flex gap={1} h="full">
        <RouterLink to="/dashboard" style={{height: "100%"}}>
          <Button as="a"  color="gray.600" bg="gray.300" h="full" aspectRatio="1">
            <i className="bi bi-arrow-left" style={{ fontSize: '1.3rem' }}></i>
          </Button>
        </RouterLink>
          <Button onClick={reFetchHtml} variant="link" color="gray.600" bg="gray.300" h="full" aspectRatio="1">
            <i className="bi bi-arrow-clockwise" style={{ fontSize: '1.3rem' }}></i>
          </Button>
      </Flex>

        <Text bg="gray.300" color="gray.600" display="flex" justifyContent="center" alignItems="center" h="full" rounded="md" fontSize="lg" px={4} flex="100%">{url}</Text>
      </Flex>


      <Box h="full" w="full" display="grid" placeItems="center" maxW="full" overflow="scroll">
        {
          loading ? (
            <Spinner size="xl" color="blue.100" /> 
          ) : (

            <div onClick={handlePaneClick} ref={paneRef} dangerouslySetInnerHTML={{__html: html}}></div>

          )
        }
      </Box>
    </Box>
  )

}

function ControlPanel() {}

export default function DashboardCreate() {
  const [globalUser, setGlobalUser] = useContext(UserContext);
  const [siteUrl, setSiteUrl] = useState("https://cnet.com");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("propelrToken")) {
      navigate("/login");
      return;
    }

    let jwtToken = globalUser?.token;
    if (!jwtToken) {
      return;
    }
  }, [globalUser]);

  return (
    <>
    {!siteUrl ? 
      (
        <AskForURL url={siteUrl} setUrl={setSiteUrl}/>
      ) : (
        <BrowserPane url={siteUrl} />
      )
    }
      </>
  )
}
