import jwtDecode from "jwt-decode";
import { Link as RouterLink } from "react-router-dom";

import ApiConfig from "../config/ApiConfig.json";
import OAuthConfig from "../config/OAuthConfig.json";

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


function GoogleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 326667 333333" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd"><path d="M326667 170370c0-13704-1112-23704-3518-34074H166667v61851h91851c-1851 15371-11851 38519-34074 54074l-311 2071 49476 38329 3428 342c31481-29074 49630-71852 49630-122593m0 0z" fill="#4285f4"/><path d="M166667 333333c44999 0 82776-14815 110370-40370l-52593-40742c-14074 9815-32963 16667-57777 16667-44074 0-81481-29073-94816-69258l-1954 166-51447 39815-673 1870c27407 54444 83704 91852 148890 91852z" fill="#34a853"/><path d="M71851 199630c-3518-10370-5555-21482-5555-32963 0-11482 2036-22593 5370-32963l-93-2209-52091-40455-1704 811C6482 114444 1 139814 1 166666s6482 52221 17777 74814l54074-41851m0 0z" fill="#fbbc04"/><path d="M166667 64444c31296 0 52406 13519 64444 24816l47037-45926C249260 16482 211666 1 166667 1 101481 1 45185 37408 17777 91852l53889 41853c13520-40185 20927-69260 92001-69260m0 0z" fill="#ea4335"/></svg>
    )
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
          const token = data.success.data.token
          setGlobalUser({
            ...jwtDecode(token),
            token: data.token,
          });
          localStorage.setItem("propelrToken", token);
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
      default: 
        console.log("you got bamboozled");
    }
      
      
  }

  if (!userLoading) {

  return (
    <Card py={2} maxW={400} w="90%"  bg="#fdfcf9"
          position="fixed"
            top="50%"
            left="50%"
            sx={{transform: "translate(-50%, -50%)"}}
          >
      <CardHeader>
        <Heading size="xl" fontFamily="heading" color="blue.200" fontWeight={800}>
          Sign Up
        </Heading>
      </CardHeader>

      <CardBody>
        <Flex justifyContent="center" flexDirection="column" w="full" my={2} gap={2}>
          <Button
            leftIcon={<GoogleIcon />}
            variant="outline"
            w="full"
            borderColor="gray.400"
            color="gray.700"
            data-provider="google"
            onClick={handleOAuthClick}
            isDisabled={isLoading}
          >
            Sign up with Google
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
    <Card h={550} maxW={400} w="90%"
          bg="#fdfcf9"
          position="fixed"
          top="50%"
          left="50%"
          sx={{transform: "translate(-50%, -50%)"}}

          display="flex"
          justifyContent="center"
          alignItems="center"

          >
      <Spinner size="xl" color="blue.100" />
    </Card>
    )
  }
}
