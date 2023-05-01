import globals from "@propelr/common/globals";
import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardHeader,
  Spinner,
  CardBody,
  CardFooter,
  Heading,
  Link,
  Button,
  Divider,
  Box,
  Flex,
  StackDivider,
  Text,
  Stack,
  Image,
} from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage, Input, FormHelperText } from '@chakra-ui/react';
import {useEffect, useState} from 'react';

import { useLocation } from "react-router-dom";

import imgMonkey2 from '../assets/dalle-monkey-2.png';
import { useToast } from '@chakra-ui/react';

import InputPassword from "./chakra/InputPassword";

function objectToQueryString(obj: any) {
  const keyValuePairs = [];

  for (const [key, value] of Object.entries(obj)) {
    keyValuePairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`);
  }

  return keyValuePairs.join('&');
}


export default function Login() {
  const location = useLocation();
  const toast = useToast();

  const [isLoading, setLoading] = useState(false);

  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [matchError, setMatchError] = useState('');

  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const oAuthParams = new URLSearchParams(location.search);

    if (!oAuthParams.get("code")) {
      setUserLoading(false);
      return;
    };

    oAuthParams.set("redirect", "http://localhost:3000/login");

    fetch(`http://localhost:4000/api/oauth/google/token?${objectToQueryString(Object.fromEntries(oAuthParams))}`)
      .then(res => res.json())
      .then(data => {

        if (data.status !== 200) {
          toast({
            title: data.error.message,
            description: data.error.details,
            position: 'top-right',
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
        } else {
          /* TODO: REDIRECT */
        }
        setUserLoading(false);
      })
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const formProps = Object.fromEntries(form);
    setLoading(true);

    fetch("http://localhost:4000/api/users/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        email: formProps.email,
        password: formProps.password
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status !== 200)  {
          toast({
            title: data.error.message,
            description: data.error.details,
            position: 'top-right',
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
        } else {
          /* TODO: REDIRECT */
        }
        setLoading(false);
      })
  }

  const handleOAuthClick = (e: any) => {
    const provider = e.currentTarget.getAttribute("data-provider");
    if (!["microsoft", "google"].includes(provider)) {
      throw new Error("Unknown provider, please refresh");
    }

    switch (provider) {
      case "google":
        const params = objectToQueryString({
          client_id: globals.GOOGLE_AUTH.CLIENT_ID,
          redirect_uri: "http://localhost:3000/login",
          scope: "email profile",
          response_type: "code"
        })
        const url = `https://accounts.google.com/o/oauth2/auth?${params}`;
        window.location.href = url;
        break;
      default: 
        console.log("you got bamboozled");
    }
      
  }

  if (!userLoading) {

  return (
    <Card h={550} maxW={600} w="90%" mx="auto" my={50}>
      <CardHeader>
        <Heading size="xl" fontFamily="heading" color="blue.200" fontWeight={800} textAlign="left">
          Log in
        </Heading>
      </CardHeader>

      <CardBody>
        <Flex justifyContent="center" flexDirection="column" w="full" my={2} gap={2}>
          <Button
            leftIcon={<i style={{ fontSize: '1.2rem' }} className="bi bi-microsoft"></i>}
            variant="solid"
            w="full"
            data-provider="microsoft"
            onClick={handleOAuthClick}
            isDisabled={isLoading}
          >
            Login with microsoft
          </Button>

          <Button
            leftIcon={<i style={{ fontSize: '1.2rem' }} className="bi bi-google"></i>}
            variant="solid"
            w="full"
            data-provider="google"
            onClick={handleOAuthClick}
            isDisabled={isLoading}
          >
            Login with google
          </Button>
        </Flex>

        <Box w="full" display="flex" alignItems="center" justifyContent="center" gap={2} my={6}>
          <Box w="50%" h="1px" bg="gray.300" rounded="full"></Box>
          <Text fontWeight="400" fontSize="sm" color="gray.500">
            OR
          </Text>
          <Box w="50%" h="1px" bg="gray.300" rounded="full"></Box>
        </Box>

        <Stack
          as="form"
          my={2}
          gap={1}
          onSubmit={handleSubmit}
        >
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" name="email" placeholder="Email" required />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <InputPassword name="password" required/>
          </FormControl>

          <Button
            variant="solid"
            type="submit"
            isLoading={isLoading}
            w={{ base: 'full' }}
          >
            Submit
          </Button>

        </Stack>
        <Text mt={3} color="gray.600">Already a registered user? <RouterLink to="/login"><Link color="blue.100" textDecoration="underline">Login</Link></RouterLink ></Text>
      </CardBody>
    </Card>

  );
  } else {
    return (
      <Card maxW={600} w="90%" mx="auto" my={50} h={550} display="flex" alignItems="center" justifyContent="center">
      <Spinner size="xl" color="blue.100" />
    </Card>
    )
  }
}
