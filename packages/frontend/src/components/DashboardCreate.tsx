import { useContext, useState, useEffect, useRef } from 'react';
import UserContext from '../context/UserContext';
import unique from 'unique-selector';


import { Link as RouterLink, useNavigate } from 'react-router-dom';

import {
  Input,
  Code,
  Progress,
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
  useToast,
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
            <FormLabel>Valid URL</FormLabel>
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
  setUrl,
  selectedHtml,
  setSelectedHtml,
}: {
  url: string;
  setUrl: any;
  selectedHtml: Array<string>;
  setSelectedHtml: any;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [html, setHtml] = useState('');
  const [globalUser, _] = useContext(UserContext);
  const [progress, setProgress] = useState(0);

  const paneRef = useRef(null);

  const fetchHtml = () => {
    setLoading(true);
    setSelectedHtml({});

    const fetchData = async () => {
      /*
      const response = await fetch(`http://localhost:4000/api/scraper?url=${encodeURIComponent(url)}`, { headers: { Authorization: `Bearer ${globalUser.token}`, } })
      const data = await response.json();
      if (data.status !== 200) {
        setError(true);
      }  else {
        setHtml(data.data.content);
      }
       */

      const xhr = new XMLHttpRequest();
      xhr.open('GET', `http://localhost:4000/api/scraper?url=${encodeURIComponent(url)}`, true);
      xhr.setRequestHeader('Authorization', `Bearer ${globalUser.token}`)

      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = event.loaded / event.total * 100;
          setProgress(Math.floor(percentComplete));
        }
      };

      xhr.onload = () => {
        const data = JSON.parse(xhr.responseText);
        setLoading(false);
        setHtml(data.data.content);
      };

      xhr.send();
    } 


    fetchData();
  };

  const handlePaneClick = (e: any) => {
    e.preventDefault();
    const selector: string = unique(e.target) as string;
    let doc = document.querySelector(`${selector}`) as any;

    if (!doc.getAttribute('propelr-selected-element')) {
      doc.setAttribute('propelr-selected-element', 'true');

      let blob: any = {};
      blob[selector] = doc.innerText || doc.src || doc.innerHTML;

      doc.style.outline = '10px solid red';
      setSelectedHtml({ ...selectedHtml, ...blob });
    } else {
      let temp = {...selectedHtml};
      delete temp[selector as any];
      setSelectedHtml(temp);
      doc.removeAttribute('propelr-selected-element');
      doc.removeAttribute('style');
    }
  };

  useEffect(() => {
    fetchHtml();
  }, [globalUser]);

  return (
    <Box w="100%" h="100vh" overflow="hidden">
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
            <Button as="a" color="gray.600" variant="link" onClick={() => {
                setUrl(null);
              }}>
              <i className="bi bi-arrow-left" style={{ fontSize: '1.4rem' }}></i>
            </Button>
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

      <Box h="full" w="full !important" overflow="scroll" position="relative">
        {loading ? (
          <Progress w="100%" isIndeterminate bg="blue.100" size="sm"/>
        ) : (
          <div
            onClick={handlePaneClick}
            ref={paneRef}
            dangerouslySetInnerHTML={{ __html: html }}
            style={{ width: "100% !important", overflow: "scroll"}}
          ></div>
        )}
      </Box>
    </Box>
  );
}

function ControlPanelFormInput({
  receiver,
  setParentError,
}: {
  receiver: string;
  setParentError: any;
}) {
  const [telNumber, setTelNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleTelChange = (e: any) => setTelNumber(e.target.value);
  const handleEmailChange = (e: any) => setEmail(e.target.value);

  const isTelValid = Boolean(Number(telNumber)) && telNumber.length === 10;
  const isEmailValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  useEffect(() => {
    if (isTelValid || isEmailValid) {
      setParentError(false);
      return;
    }
    setParentError(true);
  });

  switch (receiver) {
    case 'whatsapp':
      return (
        <FormControl my={1}>
          <FormLabel fontSize="sm">WhatsApp Number *</FormLabel>
          <InputGroup>
            <Input
              borderColor="gray.300"
              onChange={handleTelChange}
              name="receiver"
              size="sm"
              borderWidth={1}
              borderStyle="solid"
              type="tel"
              _hover={{ borderColor: 'gray.300' }}
              required
              _focus={{ outline: 'none' }}
              placeholder="Phone number"
            />
          </InputGroup>

          {!isTelValid && (
            <FormHelperText textAlign="left" color="red.500">
              Invalid Number
            </FormHelperText>
          )}
        </FormControl>
      );
    case 'email':
      return (
        <FormControl my={1}>
          <FormLabel fontSize="sm">E-Mail Address *</FormLabel>
          <Input
            borderColor="gray.400"
            borderWidth={1}
            size="sm"
            required
            borderStyle="solid"
            onChange={handleEmailChange}
            type="email"
            name="receiver"
            _hover={{ borderColor: 'gray.500' }}
            _focus={{ outline: 'none' }}
            placeholder="Email"
          />
          {!isEmailValid && (
            <FormHelperText textAlign="left" color="red.500">
              Invalid Email
            </FormHelperText>
          )}
        </FormControl>
      );
    default:
      throw new Error('Bad data, please refresh UI');
  }
}

const buildDracoQuery = (html: Array<string>, url: string) => {
  let outVars: Array<string> = [];

  let timeInMS = (6e4) * 15; // 15 minutes

  const page = `VAR page = FETCH "${url}"
    CACHE ${timeInMS}
    AS HTML HEADLESS
  `;
  const vars = html
    .map((e, idx) => {
      outVars.push(`d${idx + 1}`);
      return `VAR d${idx + 1} = EXTRACT "${e}" FROM page`;
    })
    .join('\n');

  const query = page + vars;

  return {
    syntax: query,
    vars: outVars,
  };
};

function ControlPanel({ selectedHtml, url }: { selectedHtml: Array<string>; url: string }) {
  const [receiverIdentity, setReceiverIdentity] = useState("");
  const [scheduleNone, setScheduleNone] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const toast = useToast();

  const errorToast = (title: string, desc: string) => toast({ title: title, description: desc, position: 'top-right', status: 'error', duration: 5000, isClosable: true,})

  const [globalUser, setGlobalUser] = useContext(UserContext);
  const navigate = useNavigate();

  const handleReceiverChange = (e: any) => {
    const identity = e.currentTarget.value;
    setReceiverIdentity(identity);
  };

  const handleControlSubmit = async (e: any) => {
    e.preventDefault();
    const formProps = Object.fromEntries(new FormData(e.target));

    if (!formProps.receiver) {
      toast({
        title: 'Receiver not selected',
        description: 'you need to select a receiver',
        position: 'top-right',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (Object.keys(selectedHtml).length === 0) {
      toast({
        title: 'No elements to extract',
        description: 'you need to select atleast one element',
        position: 'top-right',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const out = {
      query: buildDracoQuery(Object.keys(selectedHtml), url),
      schedule: {
        type: formProps.scheduleType,
        time: formProps.scheduledAt ?? null,
      },
      receiver: {
        identity: formProps.selectedIdentity,
        address: formProps.receiver,
      },
    };

    setLoading(true);
    let response;

    try {
      response = await fetch('http://localhost:4000/api/flows/', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + globalUser.token,
          'Content-type': 'application/json',
        },
        body: JSON.stringify(out),
      })
    } catch (error) {
      errorToast('Unable to fetch', 'was unable to fetch your request, please try again later');
      setLoading(false);
      return;
    }

    const data = await response.json();
    if (data.status !== 201) {
      errorToast(data.error.message, data.error.details);
      setLoading(false);
      return;
    }
    
    navigate("/dashboard");
  };

  const handleSelectorChange = (e: any) => {
    if (e.target.value === 'none') {
      setScheduleNone(true);
      return;
    }
    setScheduleNone(false);
  };

  useEffect(() => {
    setReceiverIdentity("email");
  }, [])

  return (
    <Box
      position="absolute"
      bg="white"
      bottom="0"
      overflow="scroll"
      p={4}
      zIndex={9999}
      rounded="md"
      sx={{ boxShadow: 'rgba(0, 0, 0, 0.56) 0px 22px 70px 4px' }}
      top={{ md: '50%' }}
      transform={{ md: 'translateY(-50%)' }}
      left={{ md: '0' }}
      w={{ base: '100%', md: 300 }}
      h={{ base: 300, md: 550 }}
      display="flex"
      flexDirection="column"
      gap={2}
      as="form"
      onSubmit={handleControlSubmit}
    >
      <Heading
        as="h2"
        size="md"
        textAlign="left"
        fontWeight={800}
        fontFamily="heading"
        color="gray.800"
      >
        Selected
      </Heading>

      <Flex flexDirection="column" w="full" minH={100} maxH={100} overflowY="scroll" rounded="sm" 
        justifyContent={ Object.keys(selectedHtml).length === 0 ? "center" : "flex-start" } 
        alignItems="center">

        {
          Object.keys(selectedHtml).length === 0 && (
            <Text color="gray.700" fontSize="sm">Click on the page to select an element</Text>
          )
        }

        {Object.keys(selectedHtml).map((el, idx) => {
          return (
            <Box
              key={idx}
              textAlign="left"
              w="full"
              bg={idx % 2 === 0 ? '#e5e7eb' : '#f3f4f6'}
              p={1}
            >
              <Text
                whiteSpace="nowrap"
                fontSize="sm"
                bg="transparent"
                textOverflow="ellipsis"
                overflow="hidden"
                maxW="40ch"
              >
                {selectedHtml[el as any]}
              </Text>
            </Box>
          );
        })}
      </Flex>


      <Box display="flex" flexDirection="column" gap={2} mt={1} mb={4}>
        <Heading
          as="h2"
          size="md"
          textAlign="left"
          fontWeight={800}
          fontFamily="heading"
          color="gray.800"
        >
          Send via
        </Heading>
        <Select name="selectedIdentity" size="sm" onChange={handleReceiverChange}>
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
            if (e.name === "Email") {
              return <option selected value={e.name.toLowerCase()}>{e.name}</option>;
            }
            return <option value={e.name.toLowerCase()}>{e.name}</option>;
          })}
        </Select>

        {receiverIdentity && (
          <ControlPanelFormInput setParentError={setError} receiver={receiverIdentity} />
        )}
      </Box>

      <Box display="flex" flexDirection="column" gap={2} mt={1} mb={4}>
        <Heading
          as="h2"
          size="md"
          textAlign="left"
          fontWeight={800}
          fontFamily="heading"
          color="gray.800"
        >
          Schedule
        </Heading>

        <Select size="sm" name="scheduleType" onChange={handleSelectorChange}>
          <option value="none" selected>
            Never
          </option>
          <option value="daily">Daily</option>
        </Select>

        {scheduleNone ? (
          <Text fontSize="sm" color="green.500" textAlign="left">
            You will have to manually execute this
          </Text>
        ) : (
          <Input placeholder="Repeat At" required size="sm" name="scheduledAt" type="time" />
        )}
      </Box>

      <Button
        py={2}
        isLoading={loading}
        isDisabled={error}
        type="submit"
        variant="solid"
        w="full"
        bg="blue.100 !important"
      >
        Create flow
      </Button>
    </Box>
  );
}

export default function DashboardCreate() {
  const [globalUser, setGlobalUser] = useContext(UserContext);
  const [siteUrl, setSiteUrl] = useState('');
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
            setUrl={setSiteUrl}
            selectedHtml={selectedHtml}
            setSelectedHtml={setSelectedHtml}
          />
          <ControlPanel selectedHtml={selectedHtml} url={siteUrl} />
        </>
      )}
    </Box>
  );
}
