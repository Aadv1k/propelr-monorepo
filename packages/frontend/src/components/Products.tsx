import * as chakra from "@chakra-ui/react";
import dalleMonkey1 from "../assets/dalle-monkey-1.png";

export default function Products() {
  return (
    <chakra.Flex flexDirection={{base : "column", md: "row"}} maxW={1400} mx="auto" justifyContent="space-between">

      
      <chakra.Flex flexDirection="column" 
        h={{base: "50%", md: "auto"}} 
        w={{base: "auto", md: "50%"}}
        p={4} justifyContent="center">
      <chakra.Heading as="h2" fontWeight={900} textAlign="left" my={2} color="blue.200" maxW="40ch ">
        With propelr, the only limitation is your creativity.
      </chakra.Heading>

      <chakra.Text textAlign="left" maxW="60ch"> Create custom workflows and access any data from the web through our powerful UI or if you like code, jump into writing your own <chakra.Link href="https://github.com/aadv1k/dracoql">DracoQL</chakra.Link> queries. Whether you're a data analyst, a marketer, or just someone who loves to explore data, Propelr is the ultimate tool to help you achieve your goals. Join the Propelr community today and unlock the true potential of your data. </chakra.Text>


      <chakra.Link textAlign="left" maxW="60ch" letterSpacing={1} textTransform="uppercase" color="blue.200" my={3}>
        Get started
      </chakra.Link>

    </chakra.Flex>


      <chakra.Box 
        h={{base: "50%", md: "auto"}} 
        w={{base: "auto", md: "50%"}}
rounded="lg">
        <chakra.Image src={dalleMonkey1} w="100%" rounded="lg"/>
      </chakra.Box>




    </chakra.Flex> 

  )
}
