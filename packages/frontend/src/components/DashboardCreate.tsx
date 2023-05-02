import { useContext, useState, useEffect, useRef } from 'react';
import UserContext from '../context/UserContext';
import unique from 'unique-selector';

import TEMP from "./TEST.json";

import { Link as RouterLink, useNavigate} from 'react-router-dom';

import {
  Input,
  Code,
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



function BrowserPane({
  url,
  selectedHtml,
  setSelectedHtml,
}: {
  url: string,
  selectedHtml: Array<string>,
  setSelectedHtml: any
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [html, setHtml] = useState("");
  const [globalUser, _] = useContext(UserContext);

  const paneRef = useRef(null);

  const fetchHtml = () => {
    setLoading(true);
    setHtml(TEMP.data.content);
    setLoading(false);

    /*
    fetch(`http://localhost:4000/api/scraper?url=${encodeURIComponent(url)}`, {
      headers: {
        Authorization: `Bearer ${globalUser.token}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status !== 200) {
          setError(true);
        }  else {
          setHtml(data.data.content);
        }
        setLoading(false)
      })
     */
  }

  const handlePaneClick = (e: any) => {
    e.preventDefault();
    const selector = unique(e.target);
    let doc = document.querySelector(`${selector}`) as any;

    console.log(doc.getAttribute("propelr-selected-element"));

    if (!doc.getAttribute("propelr-selected-element")) {
      doc.setAttribute("propelr-selected-element", "true");
      doc.style.outline = "10px solid red";
      setSelectedHtml([...selectedHtml, selector]);
    } else {


      setSelectedHtml(selectedHtml.filter(e => e !== selector));

      doc.removeAttribute("propelr-selected-element");
      doc.removeAttribute("style");
    }
  }

  useEffect(() => {
    fetchHtml();
  }, [globalUser, html])

  return (
    <Box w="100%" maxW={1200} h="100vh" overflow="hidden" border="1px solid black">

      <Flex w="full" gap={2} h={20} overflow="hidden" borderBottom="1px solid black" bg="gray.200" py={4} px={2} alignItems="center" justifyContent="space-between">
      <Flex gap={1} h="full" alignItems="center">
        <RouterLink to="/dashboard">
          <Button as="a" color="gray.600" variant="link">
            <i className="bi bi-arrow-left" style={{ fontSize: '1.4rem' }}></i>
          </Button>
        </RouterLink>
          <Button onClick={fetchHtml} variant="link" color="gray.600" style={{
              backgroundColor: "#d1d5db !important",
            }}>
            <i className="bi bi-arrow-clockwise" style={{ fontSize: '1.4rem' }}></i>
          </Button>
      </Flex>
        <Text bg="gray.300"  m="0" color="gray.600" display="flex" justifyContent="center" alignItems="center" h="full" rounded="md" fontSize={{base: "md", md: "lg"}} px={4} flex="100%">{url}</Text>
      </Flex>

      <Box h="full" w="full" overflow="scroll">
        {
          loading ? (
            <Spinner size="xl" color="blue.100"  mt="20%" /> 
          ) : (

            <div onClick={handlePaneClick} ref={paneRef} dangerouslySetInnerHTML={{__html: html}} style={{ width: "100%", }}></div>

          )
        }
      </Box>
    </Box>
  )

}

function ControlPanel({selectedHtml}: {
  selectedHtml: Array<string>
}) {
  return (
    <Box position="absolute"  w="100%" h={250} bg="gray.200" bottom="0"  zIndex={9999} sx={{
        boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px"
      }}>

      <Flex flexDirection="column" w="full">
        {selectedHtml.map(el => {
          return (
            <Box py={2} w="full">
              <Code>
                {el}
              </Code>
            </Box>
          )
        })}
      </Flex>

    </Box>
  )
}

export default function DashboardCreate() {
  const [globalUser, setGlobalUser] = useContext(UserContext);
  const [siteUrl, setSiteUrl] = useState("https://bloomberg.com");
  const  [selectedHtml, setSelectedHtml] = useState([]);

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
    <Box w="full" minH="100vh" position="relative">
    {!siteUrl ? 
      (
        <AskForURL url={siteUrl} setUrl={setSiteUrl}/>
      ) : (
        <>
        <BrowserPane 
          url={siteUrl} 
          selectedHtml={selectedHtml} setSelectedHtml={setSelectedHtml}/>
          <ControlPanel selectedHtml={selectedHtml}/>
          </>
      )
    }
      </Box>
  )
}
