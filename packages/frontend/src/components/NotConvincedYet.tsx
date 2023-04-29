import * as chakra from '@chakra-ui/react';

const dracoQuery = `VAR page = FETCH "https://coinmarketcap.com/" 
  HEADER "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0"
  AS HTML

VAR btcHtml = EXTRACT ".sc-beb003d5-3 > tbody:nth-child(3) > tr:nth-child(1) > td:nth-child(4) > div:nth-child(1) > a:nth-child(1) > span:nth-child(1)" FROM page

VAR btcPrice = EXTRACT "children.0.text" FROM btcHtml
`;

export default function NotConvincedYet() {
  return (
    <chakra.Box maxW={1400} mx="auto" p={4}>
      <chakra.Heading
        as="h2"
        fontWeight={900}
        textAlign="left"
        my={2}
        color="blue.200"
      >
        Still not convined? try out Propelr right in your browser!
      </chakra.Heading>

      <chakra.Flex gap={2} flexDirection={{ base: 'column', md: 'row' }}>
        <chakra.Box
          p={6}
          bg="white"
          borderColor="blue.200"
          borderWidth="1px"
          borderStyle="solid"
          rounded="md"
          color="black"
          display="flex"
          flexDirection="column"
          gap={4}
          w={{ base: 'full', md: '50%' }}
        >
          <chakra.Tabs>
            <chakra.TabList>
              <chakra.Tab>Query</chakra.Tab>
              <chakra.Tab>Code</chakra.Tab>
            </chakra.TabList>
            <chakra.TabPanels>
              <chakra.TabPanel>
                <chakra.Text textAlign="left" h={200}>
                  Fetch the current price of bitcoin from coinmarketcap.com
                </chakra.Text>
              </chakra.TabPanel>

              <chakra.TabPanel>
                <chakra.Code
                  h={200}
                  bg="#282828"
                  color="white.200"
                  overflowY="scroll"
                  display="block"
                  whiteSpace="break-spaces"
                  textAlign="left"
                  p={2}
                >
                  {dracoQuery}
                </chakra.Code>
              </chakra.TabPanel>
            </chakra.TabPanels>
          </chakra.Tabs>
          <chakra.Button variant="solid">Run query</chakra.Button>
        </chakra.Box>
        <chakra.Box
          p={6}
          bg="blue.200"
          rounded="md"
          color="white.100"
          display="flex"
          flexDirection="column"
          gap={4}
          w={{ base: 'full', md: '50%' }}
        >
          Output will show up here
        </chakra.Box>
      </chakra.Flex>
    </chakra.Box>
  );
}
