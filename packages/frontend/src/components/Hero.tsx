import { Heading, useMediaQuery, Text, Flex, Button } from '@chakra-ui/react';
import * as chakra from '@chakra-ui/react';
import Overlay from './Overlay';

import imgWsj from '../assets/wsj-fhd.png';
import imgGmail from '../assets/gmail-fhd.png';
import imgArrow from '../assets/arrow-y.png';
import imgMoneycontrol from '../assets/moneycontrol-fhd.png';
import imgWhatsapp from '../assets/whatsapp.png';

const data = [
  {
    src: {
      title: 'wsj.com',
      img: imgWsj,
    },
    dest: {
      title: 'gmail.com',
      img: imgGmail,
    },
  },

  {
    src: {
      title: 'moneycontrol.com',
      img: imgMoneycontrol,
    },
    dest: {
      title: 'WhatsApp',
      img: imgWhatsapp,
    },
  },
];

export default function Hero() {
  const isMobile = useMediaQuery('(max-width: 700px)');

  return (
    <>
      <chakra.Box
        display="flex"
        p={4}
        flexDirection="column"
        w="100%"
        alignItems="center"
        gap={2}
        position="relative"
        mb="3rem"
      >
        <Flex direction="column" my={6} gap={2}>
          <Heading
            as="h1"
            sx={{ textTransform: 'capitalize' }}
            fontWeight={800}
            maxW="750px"
            fontSize={{ base: '3xl', md: '5xl', lg: '7xl' }}
            color="blue.200"
          >
            Hack together your next workflow
          </Heading>
          <Text fontSize={{ base: 'md', md: 'xl' }} fontWeight={500} color="blue.200">
            Use powerful queries and a rich UI to get any data to your favourite platforms
          </Text>
        </Flex>
        <Button variant="solid" w="50%" maxW="250px" borderRadius="full" py={4}>
          Sign up
        </Button>

        <chakra.Flex
          flexDirection={{ base: 'column', md: 'row' }}
          maxW={1400}
          gap={3}
          w="100%"
          marginInline="auto"
          marginBlock="2rem"
          alignItems="center"
        >
          <Overlay
            width={isMobile ? '100%' : '60%'}
            imageSet={data.map((e) => e.src.img)}
            ms={2000}
            titleSet={data.map((e) => e.src.title)}
          />

          <chakra.Image
            src={imgArrow}
            maxW={120}
            my={10}
            transform={{ base: 'rotate(-90deg)', md: 'rotate(180deg)' }}
          />

          <Overlay
            width={isMobile ? '100%' : '60%'}
            imageSet={data.map((e) => e.dest.img)}
            ms={2000}
            titleSet={data.map((e) => e.dest.title)}
          />
        </chakra.Flex>
      </chakra.Box>
    </>
  );
}
