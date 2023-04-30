import {
  Card,
  CardHeader,
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
import React from 'react';

import InputPassword from "./chakra/InputPassword";

import imgMonkey2 from '../assets/dalle-monkey-2.png';
import { useToast } from '@chakra-ui/react';

import { Link as RouterLink } from "react-router-dom";

const sampleRegisterData = JSON.stringify({
  error: {
    code: 'user-already-exists',
    message: 'Registration Failed',
    details: 'The user with the provided email already exists in the system.',
  },
  status: 400,
});

export default function Register() {
  const [isLoading, setLoading] = React.useState(false);
  const toast = useToast();

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
          console.log(data);
        }
        setLoading(false);
      })
  }

  return (
    <Card maxW={600} w="90%" mx="auto" my={50}>
      <CardHeader>
        <Heading size="xl" fontFamily="heading" color="blue.200" fontWeight={800} textAlign="left">
          Login
        </Heading>
      </CardHeader>

      <CardBody>
        <Flex justifyContent="center" flexDirection="column" w="full" my={2} gap={2}>
          <Button
            leftIcon={<i style={{ fontSize: '1.2rem' }} className="bi bi-microsoft"></i>}
            variant="solid"
            w="full"
          >
            Login with microsoft
          </Button>

          <Button
            leftIcon={<i style={{ fontSize: '1.2rem' }} className="bi bi-google"></i>}
            variant="solid"
            w="full"
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
            <InputPassword />
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
          <Text mt={3} color="gray.600">Don't have an account yet? <RouterLink to="/register"><Link color="blue.100" textDecoration="underline">Sign up</Link> </RouterLink >
        </Text>
      </CardBody>
    </Card>
  );
}
