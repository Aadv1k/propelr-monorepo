import { Heading, useMediaQuery, Text, Flex, Button}  from "@chakra-ui/react";
import * as chakra from "@chakra-ui/react";
import imgWsj800 from "../assets/wsj-800.png";
import imgWsj320 from "../assets/wsj-320.png";
import imgGmail800 from "../assets/gmail-800.png";

export default function Overlay() {
  return (
    <chakra.Box 
      display="flex" p={4} 
      alignItems="center" justifyContent="center" 
      gap={2}
      w="full"
    >
      <chakra.Box w="full" maxW={800} position="relative" display="flex" gap={4}> 
        <chakra.Box 
          w="full" 
          sx={{ transform: "translate(-50%, -50%)", left: "50%" }} 
          position="absolute" shadow="md" 
          py={.5} 
          bg="gray.200"
        >
          <Text fontFamily="monospace" fontSize="sm" rounded="full">
            wsj.com
          </Text>
        </chakra.Box>

        <chakra.Box>
          <picture>
            <source srcSet={imgWsj800} media="(min-width: 450px)"></source>
            <img src={imgWsj800} alt="" />
          </picture>
        </chakra.Box>

        <chakra.Box 
          w="full" 
          sx={{ transform: "translate(-50%, -50%)", left: "50%" }} 
          position="absolute" shadow="md" 
          py={.5} 
          bg="gray.200"
        >
          <Text fontFamily="monospace" fontSize="sm" rounded="full">
            gmail.com
          </Text>
        </chakra.Box>

        <chakra.Box>
          <picture>
            <source srcSet={imgGmail800} media="(min-width: 450px)"></source>
            <img src={imgGmail800} alt="" />
          </picture>
        </chakra.Box>

      </chakra.Box>

    </chakra.Box>
  )
} 
