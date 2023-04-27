import {Button, ButtonGroup} from "@chakra-ui/react";

export default function LoginGroup() {
  return (
    <ButtonGroup gap={1} w="90%" maxW="300px">
      <Button variant="solid" w="50%" borderRadius="full">Sign up</Button>
      <Button variant="outline" w="50%" borderRadius="full">Login</Button>
    </ButtonGroup>
  )
}
