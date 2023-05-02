import UserContext from '../context/UserContext';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

import { Link as RouterLink } from 'react-router-dom';

import jwtDecode from 'jwt-decode';

import {
  Box,
  ButtonGroup,
  Avatar,
  Flex,
  VStack,
  Badge,
  Text,
  Skeleton,
  Button,
  Heading,
  HStack,
  Spinner,
} from '@chakra-ui/react';

const EX_DATA = {
  id: '13150a91',
  userid: '78c734f70f1892cf',
  status: 'stopped',
  query: {
    syntax:
      'VAR page = FETCH "https://coinmarketcap.com/" \r\n  HEADER "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0"\r\n  AS HTML\r\n\r\nVAR btcHtml = EXTRACT ".sc-beb003d5-3 > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(4) > div:nth-child(1) > a:nth-child(1) > span:nth-child(1)" FROM page\r\n\r\nVAR btcPrice = EXTRACT "children.0.text" FROM btcHtml',
    vars: ['btcPrice'],
  },
  schedule: {
    type: 'none',
  },
  receiver: {
    identity: 'email',
    address: 'killerrazerblade@gmail.com',
  },
  createdAt: 1682831372467,
};

function timeSince(date: number): string {
  const d = Date.now();

  const seconds = Math.ceil((d - date) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + ' years ago';
  }
  interval = Math.ceil(seconds / 2592000);
  if (interval > 1) {
    return interval + ' months ago';
  }

  interval = Math.ceil(seconds / 86400);
  if (interval > 1) {
    return interval + ' days ago';
  }
  interval = Math.ceil(seconds / 3600);
  if (interval > 1) {
    return interval + ' hours ago';
  }
  interval = Math.ceil(seconds / 60);
  if (interval > 1) {
    return interval + ' minutes ago';
  }
  return Math.ceil(seconds) + ' seconds ago';
}

function FlowList(props: any) {
  return (
    <VStack>
      {props.flows.map((flow: any) => {
        return (
          <Flex flexDirection={{base: "column", md: "row"}} gap={2} h={{base: "auto", md: 20}} w="full" justifyContent="space-between" px={2} py={4} >
            <Flex flexDirection="column" alignSelf={{base: "flex-start", md: "center"}}>
              <Heading
                textAlign="left"
                fontWeight={800}
                fontSize="2xl"
                fontFamily="body"
                color="gray.700"
              >
                {flow.userid}
                <Badge colorScheme='green' fontSize="0.8rem" ml="1">{flow.schedule.type}</Badge>
              </Heading>

              <Text textAlign="left" color="gray.600">
                {timeSince(flow.createdAt)}
              </Text>
            </Flex>

            <ButtonGroup alignSelf={{base: "center"}}>
              {flow.status === 'running' ? (
                <Button
                  rounded="full"
                  aspectRatio="1"
                  h="100%"
                  bg="red.400"
                  color="white"
                  _hover={{ bg: 'red.500', color: 'white' }}
                  _focus={{ bg: 'red.500', color: 'white' }}
                >
                  <i className="bi bi-stop-fill" style={{ fontSize: '1.5rem' }}></i>
                </Button>
              ) : (
                <Button
                  rounded="full"
                  aspectRatio="1"
                  h="100%"
                  bg="yellow.200"
                  color="black"
                  _hover={{ bg: 'yellow.100', color: 'black' }}
                  _focus={{ bg: 'yellow.100', color: 'black' }}
                >
                  <i className="bi bi-play-fill" style={{ fontSize: '1.5rem' }}></i>
                </Button>
              )}

                <Button
                  rounded="full"
                  aspectRatio="1"
                  h="100%"
                  bg="yellow.200"
                  color="black"
                  _hover={{ bg: 'yellow.100', color: 'black' }}
                  _focus={{ bg: 'yellow.100', color: 'black' }}
                >
                <i className="bi bi-lightning-charge-fill" style={{ fontSize: '1.4rem' }}></i>
              </Button>
            </ButtonGroup>
          </Flex>
        );
      })}
    </VStack>
  );
}

export default function Dashboard() {
  const [globalUser, setGlobalUser] = useContext(UserContext);
  const navigate = useNavigate();

  const toast = useToast();

  const [flows, setFlows] = useState([]);
  const [flowsLoading, setFlowsLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("propelrToken")) {
      navigate("/login");
      return;
    }

    let jwtToken = globalUser?.token;
    if (!jwtToken) {
      return;
    }

    setFlowsLoading(true);
    setFlows([EX_DATA] as any);
    setFlowsLoading(false);

    /*
    try {
      fetch('http://localhost:4000/api/flows', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${globalUser.token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setFlows(data.data);
          setFlowsLoading(false);
        })
        .catch(() => {
          toast({
            title: 'Unable to fetch!',
            description: 'We were unable to fetch your flows, plese try again later',
            position: 'top-right',
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
          setFlowsLoading(false);
        });
    } catch (error) {}
     */
  }, [globalUser]);

  return (
    <Box w="full" maxW={1400} mx="auto" minH="100vh" py={6} px={8}>
      <Flex alignItems="center" justifyContent="space-between" p={4}>
        <Flex gap={2}>
          <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
          <Flex alignItems="start" flexDirection="column">
            <Text color="gray.400" fontSize="sm">
              Good morning
            </Text>
            <Text color="gray.700" fontSize="md">
              John doe
            </Text>
          </Flex>
        </Flex>
        <Button variant="solid" aspectRatio="1">
          <i className="bi bi-box-arrow-left"></i>
        </Button>
      </Flex>

      <Box my={6}>
        <Heading
          as="h2"
          color="blue.200"
          fontFamily="heading"
          textAlign="left"
          fontWeight={800}
          fontSize="4xl"
          mb={4}
        >
          Quick glance
        </Heading>
        <Flex
          gap={4}
          h={{ md: 150 }}
          w={{ base: 'full', md: 800 }}
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <Flex
            borderWidth="2px"
            borderColor="gray.500"
            rounded="md"
            borderStyle="dashed"
            alignItems="center"
            py={6}
            justifyContent="center"
            h="full"
            w={{ base: 'full', md: '25%' }}
          >


            <RouterLink to="/dashboard/create">
              <Button as="a" variant="solid">Create flow</Button>
            </RouterLink>

          </Flex>

          <Flex
            shadow="sm"
            borderWidth="2px"
            borderColor="#EEE4C8"
            rounded="xl"
            borderStyle="dashed"
            bg="#EEE4C8"
            justifyContent="space-between"
            flexDirection="column"
            p={4}
            h="full"
            w={{ base: 'full', md: '40%' }}
          >
            <Skeleton
              h="70%"
              isLoaded={!flowsLoading}
              endColor="#ffa177"
              startColor="#ffc4ab"
              my={2}
            >
              <HStack>
                <Heading color="gray.700" fontFamily="heading" fontSize="4xl" fontWeight={800}>
                  {flows.length} flows
                </Heading>
                <Text color="gray.600">/ 500</Text>
              </HStack>
            </Skeleton>
            <Text color="gray.600" textAlign="left">
              You will be unable to create more when this runs out
            </Text>
          </Flex>

          <Flex
            shadow="sm"
            borderWidth="2px"
            borderColor="#EEE4C8"
            rounded="xl"
            borderStyle="dashed"
            bg="#EEE4C8"
            justifyContent="space-between"
            flexDirection="column"
            p={4}
            h="full"
            w={{ base: 'full', md: '40%' }}
          >
            <Skeleton
              h="100%"
              isLoaded={!flowsLoading}
              startColor="#ffc4ab"
              endColor="#ffa177"
              my={2}
            >
              <HStack>
                <Heading color="gray.700" fontFamily="heading" fontSize="4xl" fontWeight={800}>
                  {flows.filter((e: any) => e.status === 'running').length} Active
                </Heading>
              </HStack>
            </Skeleton>
            <Text color="gray.600" textAlign="left">
              flows are currently running
            </Text>
          </Flex>
        </Flex>
      </Box>

      <Box my={6}>
        <Heading
          as="h2"
          color="blue.200"
          textAlign="left"
          fontWeight={800}
          fontSize="4xl"
          mb={4}
        >
          Flows
        </Heading>

        {flowsLoading ? (
          <Spinner size="xl" color="blue.100" />
        ) : (
          <FlowList flows={flows} setFlows={setFlows} />
        )}
      </Box>
    </Box>
  );
}
