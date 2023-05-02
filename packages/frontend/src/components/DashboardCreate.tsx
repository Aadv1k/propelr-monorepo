import { useContext, useState, useEffect, useRef } from 'react';
import UserContext from '../context/UserContext';
import unique from 'unique-selector';

import TEMP from './TEST.json';

import { Link as RouterLink, useNavigate } from 'react-router-dom';

import {
  Input,
  Code,
  Text,
  Spinner,
  Wrap,
  WrapItem,
  ButtonGroup,
  Select,
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

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

function AskForURL({ url, setUrl }: { url: string; setUrl: any }): any {
  const [error, setError] = useState(false);

  const handleChange = (e: any) => {
    const targetUrl = e.target.value;

    if (!targetUrl.match(URL_REGEX)) {
      setError(true);
      return;
    }
    setError(false);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const targetUrl: string = form.get('url') as string;
    setUrl(targetUrl);
  };

  return (
    <Flex
      minH="100vh"
      w="100%"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap={6}
    >
      <RouterLink to="/dashboard">
        <Button
          as="a"
          size="lg"
          position="absolute"
          top={4}
          left={4}
          alignSelf="flex-end"
          variant="link"
        >
          <i className="bi bi-arrow-left" style={{ fontSize: '3rem' }}></i>
        </Button>
      </RouterLink>

      <VStack maxW={700} w="80%" gap={2} alignItems="left">
        <Heading textAlign="left" fontWeight={800} color="gray.700">
          Let's Start!
        </Heading>
        <Text textAlign="left" color="gray.600">
          First, enter a URL. We will fetch the HTML for you, this process isn't perfect and markup
          may differ from the browser
        </Text>
      </VStack>

      <Box bg="white.200" shadow="none" w="80%" maxW={700} h="auto">
        <Flex as="form" onSubmit={handleSubmit} flexDirection="column" gap={4} w="full">
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input onChange={handleChange} required name="url" placeholder="enter a valid url..." />
            {error && (
              <FormHelperText color="red.500" textAlign="left">
                Invalid URL, please check again
              </FormHelperText>
            )}
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
  url: string;
  selectedHtml: Array<string>;
  setSelectedHtml: any;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [html, setHtml] = useState('');
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
  };

  const handlePaneClick = (e: any) => {
    e.preventDefault();
    const selector = unique(e.target);
    let doc = document.querySelector(`${selector}`) as any;

    console.log(doc.getAttribute('propelr-selected-element'));

    if (!doc.getAttribute('propelr-selected-element')) {
      doc.setAttribute('propelr-selected-element', 'true');
      doc.style.outline = '10px solid red';
      setSelectedHtml([...selectedHtml, selector]);
    } else {
      setSelectedHtml(selectedHtml.filter((e) => e !== selector));

      doc.removeAttribute('propelr-selected-element');
      doc.removeAttribute('style');
    }
  };

  useEffect(() => {
    fetchHtml();
  }, [globalUser, html]);

  return (
    <Box  w="100%" h="100vh" overflow="hidden" border="1px solid black">
      <Flex
        w="full"
        gap={2}
        h={12}
        overflow="hidden"
        borderBottom="1px solid black"
        bg="gray.200"
        py={4}
        px={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex gap={1} h="full" alignItems="center">
          <RouterLink to="/dashboard">
            <Button as="a" color="gray.600" variant="link">
              <i className="bi bi-arrow-left" style={{ fontSize: '1.4rem' }}></i>
            </Button>
          </RouterLink>
          <Button
            onClick={fetchHtml}
            variant="link"
            color="gray.600"
            style={{
              backgroundColor: '#d1d5db !important',
            }}
          >
            <i className="bi bi-arrow-clockwise" style={{ fontSize: '1.4rem' }}></i>
          </Button>
        </Flex>
        <Text
          m="0"
          color="gray.600"
          display="flex"
          justifyContent="center"
          alignItems="center"
          h="full"
          rounded="md"
          fontSize={{ base: 'md', md: 'lg' }}
          px={4}
          flex="100%"
        >
          {url}
        </Text>
      </Flex>

      <Box h="full" w="full" overflow="scroll">
        {loading ? (
          <Spinner size="xl" color="blue.100" mt="20%" />
        ) : (
          <div
            onClick={handlePaneClick}
            ref={paneRef}
            dangerouslySetInnerHTML={{ __html: html }}
            style={{ width: '100%' }}
          ></div>
        )}
      </Box>
    </Box>
  );
}

function ControlPanelFormInput({ receiver }: { receiver: string }) {
  const [telNumber, setTelNumber] = useState("");
  const [email, setEmail] = useState("");

  const handleTelChange = (e: any) => setTelNumber(e.target.value);
  const handleEmailChange = (e: any) => setEmail(e.target.value);

  const isTelValid = Boolean(Number(telNumber)) && telNumber.length === 10;
  const isEmailValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  switch (receiver) {
    case 'whatsapp':
      return (
        <FormControl my={2}>
          <FormLabel>Registered WhatsApp Number *</FormLabel>
          <InputGroup>
            <InputLeftAddon
              children="+91"
              bg="gray.300"
              borderColor="gray.300"
              borderWidth={1}
              borderStyle="solid"
            />
            <Input
              borderColor="gray.300"
              onChange={handleTelChange}
              borderWidth={1}
              borderStyle="solid"
              type="tel"
              _hover={{ borderColor: 'gray.300' }}
              _focus={{ outline: 'none' }}
              placeholder="Phone number"
            />
          </InputGroup>

          {!isTelValid && <FormHelperText textAlign="left" color="red.500">Invalid Number</FormHelperText>}
        </FormControl>
      );
    case 'email':
      return (
        <FormControl my={2}>
          <FormLabel>Valid E-Mail Address *</FormLabel>
        <Input
          borderColor="gray.400"
          borderWidth={1}
          borderStyle="solid"
          onChange={handleEmailChange}
          type="email"
          _hover={{ borderColor: 'gray.500' }}
          _focus={{ outline: 'none' }}
          placeholder="Email"
        />
          {!isEmailValid && <FormHelperText textAlign="left" color="red.500">Invalid Email</FormHelperText>}
</FormControl>

      );
    default:
      throw new Error('Bad data, please refresh UI');
  }
}

function ControlPanel({ selectedHtml }: { selectedHtml: Array<string> }) {
  const [receiverIdentity, setReceiverIdentity] = useState(null);

  const handleReceiverButtonClick = (e: any) => {
    const identity = e.currentTarget.getAttribute('data-identity');
    setReceiverIdentity(identity);
  };

  return (
    <Box
      position="absolute"
      bg="white"
      bottom="0"
      overflow="scroll"
      p={4}
      zIndex={9999}

      rounded="md"

      shadow="2xl"
      border="2px solid black"

      top={{md: "50%"}}
      transform={{md: "translateY(-50%)"}}
      left={{md: "0"}}
      w={{base: "100%", md: 300}}
      h={{base: 300, md: 500}}

      as="form"
    >
      {/*
      <Heading as="h2" size="lg" textAlign="left" fontWeight={800} fontFamily="heading" color="gray.800">Selected</Heading>
      <Flex flexDirection="column" w="full" maxH={150} overflowY="scroll">
        {selectedHtml.map((el, idx) => {
          return (
            <Box 
              key={idx}
              textAlign="left"
              w="full"
              bg={idx % 2 === 0 ? "gray.400" : "gray.300"}
            >
              <Code 
                whiteSpace="nowrap"
                bg="transparent"
                textOverflow="ellipsis"
                overflow="hidden"
                maxW="40ch"
              >{el}</Code>
            </Box>
          );
        })}
      </Flex>
        */}

      <Box display="flex" flexDirection="column" gap={2} mt={1} mb={4}>

      <Heading
        as="h2"
        size="lg"
        textAlign="left"
        fontWeight={800}
        fontFamily="heading"
        color="gray.800"
      >
        Send to
      </Heading>
      <Wrap gap={1}>
        {[
          {
            name: 'WhatsApp',
            icon: 'bi-whatsapp',
          },

          {
            name: 'Email',
            icon: 'bi-envelope-fill',
          },
        ].map((e) => {
          return (
            <WrapItem>
              <Button
                data-identity={e.name.toLowerCase()}
                size="sm"
                onClick={handleReceiverButtonClick}
                leftIcon={<i className={`bi ${e.icon}`} style={{ fontSize: '1.2rem' }}></i>}
                variant="solid"
                h={10}
                bg="blue.100 !important"
              >
                {e.name}
              </Button>
            </WrapItem>
          );
        })}
      </Wrap>

      {receiverIdentity && <ControlPanelFormInput receiver={receiverIdentity} />}

      </Box>

      <Box display="flex" flexDirection="column" gap={2} mt={1} mb={4}>
      <Heading
        as="h2"
        size="lg"
        textAlign="left"
        fontWeight={800}
        fontFamily="heading"
        color="gray.800"
      >
        Schedule
      </Heading>


      </Box>


      <Button variant="solid" w="full" bg="blue.100 !important">Create flow</Button>

    </Box>
  );
}

export default function DashboardCreate() {
  const [globalUser, setGlobalUser] = useContext(UserContext);
  const [siteUrl, setSiteUrl] = useState('https://bloomberg.com');
  const [selectedHtml, setSelectedHtml] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('propelrToken')) {
      navigate('/login');
      return;
    }

    let jwtToken = globalUser?.token;
    if (!jwtToken) {
      return;
    }
  }, [globalUser]);

  return (
    <Box w="full" minH="100vh" position="relative">
      {!siteUrl ? (
        <AskForURL url={siteUrl} setUrl={setSiteUrl} />
      ) : (
        <>
          <BrowserPane
            url={siteUrl}
            selectedHtml={selectedHtml}
            setSelectedHtml={setSelectedHtml}
          />
          <ControlPanel selectedHtml={selectedHtml} />
        </>
      )}
    </Box>
  );
}
