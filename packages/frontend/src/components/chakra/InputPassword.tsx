import { Input, InputGroup, InputRightElement, Button} from "@chakra-ui/react";
import React from "react";

export default function InputPassword(props: any) {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)

  return (
    <InputGroup size='md'>
      <Input
        pr='4.5rem'
        type={show ? 'text' : 'password'}
        placeholder='Password'
        {...props}
      />
      <InputRightElement width='4.5rem'>
        <Button tabIndex={-1} color="gray.400" size='sm' variant="none" onClick={handleClick}>
          <i
              style={{
                  fontSize: "1.5rem"
              }}
              className={`bi ${show ? "bi-eye-slash" : "bi-eye"}`}>
          </i>
        </Button>

      </InputRightElement>
    </InputGroup>
  )
}
