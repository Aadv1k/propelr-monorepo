import * as chakra from "@chakra-ui/react";

export default function Products() {
  return (
    <chakra.Box maxW={1400} mx="auto" p={4}>
      <chakra.Heading as="h2" fontWeight={900} textAlign="left" my={2} color="blue.200" maxW="40ch ">
        Pricing
      </chakra.Heading>

      <chakra.Card bg="blue.100" p={4}>
        <chakra.Heading as="h1" color="yellow.100" fontFamily="heading" textAlign="left" size="3xl" fontWeight={900}>
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

    </chakra.Box> 

  )
}
