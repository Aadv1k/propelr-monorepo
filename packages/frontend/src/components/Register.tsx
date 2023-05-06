import jwtDecode from "jwt-decode";
import { Link as RouterLink } from "react-router-dom";

import OAuthConfig from "@propelr/common/config/OAuthConfig";
import ApiConfig from "@propelr/common/config/ApiConfig";

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
import { useEffect, useState, useContext } from 'react';

import UserContext from "../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";

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


export default function Register() {
  const location = useLocation();
  const toast = useToast();

  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [matchError, setMatchError] = useState('');

  const [globalUser, setGlobalUser] = useContext(UserContext);

  const [userLoading, setUserLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("propelrToken")) {
      navigate("/dashboard")
      return;
    };

    let provider = localStorage.getItem("propelrOAuthProvider");
    if (!provider) {
      return;
    };


    setUserLoading(true);

    const oAuthParams = new URLSearchParams(location.search);
    if (!oAuthParams.get("code")) {
      setUserLoading(false);
      return;
    };

    navigate(location.pathname, {});

    oAuthParams.set("redirect", OAuthConfig.GOOGLE_AUTH.REDIRECT);

    fetch(`${ApiConfig.base}/api/oauth/${provider}/token?${objectToQueryString(Object.fromEntries(oAuthParams))}`)
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
          const parsedToken: any = jwtDecode(data.token);
          setGlobalUser({
            ...parsedToken,
            token: data.token,
          });
          localStorage.setItem("propelrToken", data.token);
          setLoading(false);
          window.localStorage.removeItem("propelrOAuthProvider");
          navigate("/dashboard");
        }
        setUserLoading(false);
      })
  }, []);

  const handlePasswordChange = (event: any) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    if (newPassword.length < 8) {
      setPasswordError('Password must be 8 characters long.');
      setError(true);
    } else {
      setPasswordError('');
      setError(false);
    }
  };

  const handleRepeatPasswordChange = (event: any) => {
    const newRepeatPassword = event.target.value;
    setRepeatPassword(newRepeatPassword);
    if (newRepeatPassword !== password) {
      setMatchError('Passwords do not match.');
      setError(true);
    } else {
      setMatchError('');
      setError(false);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const formProps = Object.fromEntries(form);
    setLoading(true);
    fetch(`${ApiConfig.base}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        username: formProps.username,
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
          setGlobalUser({
            ...jwtDecode(data.token),
            token: data.token,
          });
          localStorage.setItem("propelrToken", data.token);
          navigate("/dashboard");
        }
        setLoading(false);
      })
  }

  const handleOAuthClick = (e: any) => {
    const provider = e.currentTarget.getAttribute("data-provider");
    if (!["microsoft", "google"].includes(provider)) {
      throw new Error("Unknown provider, please refresh");
    }

    window.localStorage.setItem("propelrOAuthProvider", provider);

    switch (provider) {
      case "google": { 
        const params = objectToQueryString({
          client_id: OAuthConfig.GOOGLE_AUTH.CLIENT_ID,
          redirect_uri: OAuthConfig.GOOGLE_AUTH.REDIRECT,
          scope: "email profile",
          response_type: "code"
        })
        const url = `https://accounts.google.com/o/oauth2/auth?${params}`;
        window.location.href = url;
        break; 
      }
      case "microsoft": {
        const params = objectToQueryString({
          client_id: OAuthConfig.MS_AUTH.CLIENT_ID,
          redirect_uri: OAuthConfig.MS_AUTH.REDIRECT,
          scope: "User.Read",
          response_type: "code"
        })
        const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`;
        window.location.href = url;
        break;
      }
      default: 
        console.log("you got bamboozled");
    }
      
      
  }

  if (!userLoading) {

  return (
    <Card  maxW={600} w="90%" mx="auto" my={50}>
      <CardHeader>
        <Heading size="xl" fontFamily="heading" color="blue.200" fontWeight={800} textAlign="left">
          Sign Up
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
            Sign up with microsoft
          </Button>

          <Button
            leftIcon={<i style={{ fontSize: '1.2rem' }} className="bi bi-google"></i>}
            variant="solid"
            w="full"
            data-provider="google"
            onClick={handleOAuthClick}
            isDisabled={isLoading}
          >
            Sign up with google
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
            <FormLabel>Username</FormLabel>
            <Input type="text" name="username" placeholder="Username" required />
          </FormControl>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input type="email" name="email" placeholder="Email" required />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <InputPassword name="password" onChange={handlePasswordChange} required/>
            {passwordError && (
              <Text textAlign="left" color="red.600">
                Need a stronger password
              </Text>
            )}
          </FormControl>

          <FormControl>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              placeholder="Confirm password"
              onChange={handleRepeatPasswordChange}
              required
            />
            {matchError && (
              <Text textAlign="left" color="red.600">
                Passwords don't match
              </Text>
            )}
          </FormControl>

          <Button
            variant="solid"
            type="submit"
            isDisabled={isError}
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
      <Card maxW={600} w="90%" mx="auto" my={50} h={600} display="flex" alignItems="center" justifyContent="center">
      <Spinner size="xl" color="blue.100" />
    </Card>
    )
  }
}
