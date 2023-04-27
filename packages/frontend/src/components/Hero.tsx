import { Heading, useMediaQuery, Text, Flex, Button}  from "@chakra-ui/react";
import * as chakra from "@chakra-ui/react";
import Overlay from "./Overlay";


export default function Hero() {
  return (
    <>
    <chakra.Box display="flex" p={4} flexDirection="column" w="100%" h="50vh" alignItems="center" justifyContent="center" gap={2} position="relative">
      <Flex direction="column"  my={6} gap={2}>
        <Heading as="h1" sx={{textTransform: "capitalize"}} fontWeight={800} maxW="750px" fontSize={{ base: "3xl", md: "5xl", lg: "7xl"}} color="blue.200">
          Hack together your next workflow
        </Heading>
        <Text fontSize={{ base: "md", md: "xl"}} fontWeight={500} color="blue.200">
          Use powerful queries and a rich UI to get any data to your favourite platforms
        </Text>
      </Flex>
      <Button variant="solid" w="50%" maxW="250px" borderRadius="full">Sign up</Button>
    </chakra.Box>

    <Overlay />
      </>
  )
}
