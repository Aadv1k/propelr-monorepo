import { Heading, useMediaQuery, Text, Flex, Button}  from "@chakra-ui/react";
import * as chakra from "@chakra-ui/react";

import imgWsj800 from "../assets/wsj-800.png";
import imgGmail800 from "../assets/gmail-800.png";
import imgNse800 from "../assets/nseindia-800.png"
import imgWhatsapp from "../assets/whatsapp.png"

import imgUpArrow from "../assets/up-arrow.png";
import React from "react";

const data = [
  {
    title1: "wsj.com",
    src1: imgWsj800,
    title2: "gmail",
    src2: imgGmail800
  },

  {
    title1: "nseindia.com",
    src1: imgNse800,
    title2: "whatsapp",
    src2: imgWhatsapp  
  },

]

export default function Overlay() {
  const [imageIndex, setImageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <chakra.Box 
      display="flex" p={4} 
      alignItems="center" justifyContent="center" 
      flexDirection={{base: "column",  md: "row"}}
      gap={6}
      w="100%"
      maxW={1200}
      mx="auto"
    >
      <chakra.Box w={{base: "100%", md: "50%"}} position="relative" display="flex" gap={4}> 
        <chakra.Box w="full" sx={{ transform: "translate(-50%, -50%)", left: "50%" , zIndex: 10}} position="absolute" shadow="md" py={.5} bg="gray.200">
          <Text fontFamily="monospace" fontSize="sm" rounded="full">
            {data[imageIndex].title1}
          </Text>
        </chakra.Box>

        <chakra.Box sx={{ position: "relative", width: "100%", height: "500px", overflow: "hidden"}}>
          {data.map((image, i) => (
            <chakra.Image
              key={i}
              src={image.src1}
              alt={`Slide ${i}`}
              boxSize="100%"
              objectFit="cover"
              position="absolute"
              top="0"
              left={`${100 * (i - imageIndex)}%`}
              transition="left 0.5s ease-in-out"
            />
          ))}
        </chakra.Box>

      </chakra.Box>


      <chakra.Box w="30%" maxW={20} transform={{base: "rotate(180deg)", md: "rotate(90deg)"}}>
          <img src={imgUpArrow} alt="" />
        </chakra.Box>


      <chakra.Box w={{base: "100%", md: "50%"}} position="relative" display="flex" gap={4}> 
        <chakra.Box w="full" sx={{ transform: "translate(-50%, -50%)", left: "50%", zIndex: 2}} position="absolute" shadow="md" py={.5} bg="gray.200">
          <Text fontFamily="monospace" fontSize="sm" rounded="full">
            {data[imageIndex].title2}
          </Text>
        </chakra.Box>

        <chakra.Box sx={{ position: "relative", width: "100%",  height: "500px", overflow: "hidden"}}>
          {data.map((image, i) => (
            <chakra.Image
              key={i}
              src={image.src2}
              alt={`Slide ${i}`}
              boxSize="100%"
              objectFit="cover"
              position="absolute"
              top="0"
              left={`${100 * (i - imageIndex)}%`}
              transition="left 0.5s ease-in-out"
            />
          ))}
        </chakra.Box>
      </chakra.Box>

    </chakra.Box>
  )
} 
