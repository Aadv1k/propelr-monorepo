import UserContext from '../context/UserContext';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import jwtDecode from 'jwt-decode';

import {
  Box,
  WrapItem,
  Avatar,
  Flex,
  VStack,
  Text,
  Button,
  Heading,
  HStack,
  Spinner,
} from '@chakra-ui/react';

function FlowList(props: any) {
  return (
    <h1>
      {props.flows.map((flow: any) => {
        return <p>{flow.query.syntax}</p>;
      })}
    </h1>
  );
}

export default function Dashboard() {
  const [globalUser, setGlobalUser] = useContext(UserContext);
  const navigate = useNavigate();

  const [flows, setFlows] = useState([]);
  const [flowsLoading, setFlowsLoading] = useState(false);

  useEffect(() => {
    let jwtToken = globalUser?.token;

    if (!jwtToken) {
      return;
    } 

    setFlowsLoading(true);

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
      });
  }, [globalUser]);

    return (
      <Box w="full" minH="100vh" py={6} px={8}>
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

        <Box my={4}>
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
              <Button variant="solid">Create flow</Button>
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
              <HStack>
                <Heading color="gray.700" fontFamily="heading" fontSize="4xl" fontWeight={800}>
                  4 flows
                </Heading>
                <Text color="gray.600">/ 500</Text>
              </HStack>
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
              <HStack>
                <Heading color="gray.700" fontFamily="heading" fontSize="4xl" fontWeight={800}>
                  2 Active
                </Heading>
              </HStack>
              <Text color="gray.600" textAlign="left">
                flows are currently running
              </Text>
            </Flex>
          </Flex>
        </Box>

        <Box my={4}>
          <Heading
            as="h2"
            color="blue.200"
            fontFamily="heading"
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
