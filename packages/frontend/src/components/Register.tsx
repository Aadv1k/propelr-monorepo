import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Link,
  Button,
  Box,
  Flex,
  StackDivider,
  Text,
  Stack,
  Image,
} from '@chakra-ui/react';
import { FormControl, FormLabel, FormErrorMessage, Input, FormHelperText } from '@chakra-ui/react';
import React from "react";

import imgMonkey2 from '../assets/dalle-monkey-2.png';

export default function Register() {
  const [password, setPassword] = React.useState("");
  const [repPassword, setRepPassword] = React.useState("");
  const [email, setEmail] = React.useState("");

  const [isNotSamePassword, setNotSamePassword] = React.useState(false);
  const [isBadPassword, setBadPassword] = React.useState(false);
  const [isError, setError] = React.useState(false);

  React.useEffect(() => {
    setNotSamePassword(password !== repPassword);
    setBadPassword((password.length < 8) && password !== "");
    setError(isNotSamePassword || isBadPassword);
  })
  

  return (
    <Card maxW={800} w="90%" mx="auto" my={100}>
      <CardHeader>
        <Heading size="xl" fontFamily="heading" color="blue.200" fontWeight={800} textAlign="left">
          Sign Up
        </Heading>
      </CardHeader>

      <CardBody>
        <Stack as="form" onSubmit={((e) => {
            e.preventDefault();
          })}>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input type="email" name="email" required/>
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input type="password" name="password" onChange={(e) => setPassword(e.target.value)} required/>
            {isBadPassword && <Text textAlign="left" color="red.600">Need a stronger password</Text>}
          </FormControl>

          <FormControl>
            <FormLabel>Confirm Password</FormLabel>
            <Input type="password" onChange={(e) => setRepPassword(e.target.value)} required/>
            {isNotSamePassword && <Text textAlign="left" color="red.600">Passwords don't match</Text>}
          </FormControl>


          <Button variant="solid" sx={{marginTop: "1rem"}} type="submit" isDisabled={isError} w={{ base: 'full', md: 200 }}> Submit </Button>
        </Stack>

      </CardBody>
    </Card>
  );
}
