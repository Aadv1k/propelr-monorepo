import * as chakra from "@chakra-ui/react";

export default function Products() {
  return (
    <chakra.Box display="flex" flexDirection={{base: "column", md: "row"}} maxW={1400} mx="auto" p={4} as="section" id="pricing" gap={2}>
      <chakra.Card

                   minH={400}
          bg="blue.100" p={4} flex="50%">
        <chakra.Heading as="h1" color="yellow.100" fontFamily="heading" textAlign="left" size="2xl" fontWeight={900}>
          Free
        </chakra.Heading>
        <chakra.CardBody>
          <chakra.Text textAlign="left" color="yellow.100" my={2} maxW="60ch">
            Our product is still in active development, hence we provide all users with free resources. These terms are subject to change in the future
          </chakra.Text>


          <chakra.UnorderedList color="white.200" textAlign="left">
            <chakra.ListItem>Upto 150 workflows to fetch data</chakra.ListItem>
            <chakra.ListItem>Upto 5K Queries a month</chakra.ListItem>
            <chakra.ListItem>Upto 10 connections, incl Discord, Gmail, Outlook and WhatsApp</chakra.ListItem>
          </chakra.UnorderedList>
        </chakra.CardBody>

          <chakra.CardFooter>
            <chakra.Button variant='ghost' color="white" style={{border: "1px solid white"}}>
        Start now
      </chakra.Button>
  </chakra.CardFooter>
      </chakra.Card>

      <chakra.Card opacity="0.8"
                   cursor="not-allowed"
                   minH={400}
                   userSelect="none"
                   bg="transparent" borderWidth="1px" borderStyle="solid" borderColor="blue.100" p={4} flex="50%">
        <chakra.Heading as="h1" fontFamily="heading" textAlign="left" size="2xl" fontWeight={900}>
          Pro
        </chakra.Heading>
        <chakra.CardBody>
          <chakra.UnorderedList color="gray.800" textAlign="left">
            <chakra.ListItem>Upto 500 workflows to fetch data</chakra.ListItem>
            <chakra.ListItem>Unlimited Queries</chakra.ListItem>
            <chakra.ListItem>Unlimited connection</chakra.ListItem>
            <chakra.ListItem>Support for importing queries</chakra.ListItem>
          </chakra.UnorderedList>
        </chakra.CardBody>
      </chakra.Card>

    </chakra.Box> 

  )
}
