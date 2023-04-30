import { Input, InputGroup, InputRightElement, Button} from "@chakra-ui/react";
import React from "react";

export default function InputPassword() {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)

  return (
    <InputGroup size='md'>
      <Input
        pr='4.5rem'
        type={show ? 'text' : 'password'}
        placeholder='Password'
      />
      <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' variant="outline" onClick={handleClick}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}
