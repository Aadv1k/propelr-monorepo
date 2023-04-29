import { Heading, useMediaQuery, Text, Flex, Button}  from "@chakra-ui/react";
import * as chakra from "@chakra-ui/react";

import "bootstrap-icons/font/bootstrap-icons.css";

import React from "react";

export default function Overlay({ width, imageSet, ms, titleSet}: {
  width: string,
  imageSet: Array<string>,
  titleSet: Array<string>,
  ms?: number
}) {

  const [imgIndex, setIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % imageSet.length);
    }, ms ?? 5000);


    return () => clearInterval(interval);
  }, []);


  return (
    <chakra.Box w={width as string} maxW={800} bg="blue.200" rounded="md" shadow="lg" sx={{
      aspectRatio: "16/9",
      position: "relative",
        overflow: "hidden",
    }}>


      {imageSet.map((image: string, i: number) => (
        <chakra.Image
          key={i}
          src={image}
          alt={`Slide ${i}`}
          boxSize="100%"
          objectFit="cover"
          position="absolute"
          left="0"
          top={`${100 * (i - imgIndex)}%`}
          transition="top 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) 0s"
        />

      ))}


      <chakra.Flex 
        position="absolute" 
        h={{base: 6, md: 8}} w="100%" 
        bg="#d9dddc"
        inset="0"
        alignItems="center"
        shadow="md"
        justifyContent="space-evenly"
      >

        <chakra.Flex  sx={{border: "1px solid black", aspectRatio: "1"}} h="100%" alignItems="center" justifyContent="center">
          <i className="bi bi-lock" style={{fontSize: "1rem"}}></i>
        </chakra.Flex>

        <chakra.Flex flex="100%" textAlign="left" px={2} sx={{borderBlock: "1px solid black"}} h="100%" alignItems="center">
          {titleSet[imgIndex]}
        </chakra.Flex>

        <chakra.Flex sx={{border: "1px solid black", aspectRatio: "1"}} h="100%" alignItems="center" justifyContent="center">
          <i className="bi bi-search" style={{fontSize: ".9rem"}}></i>
        </chakra.Flex>

      </chakra.Flex>

    </chakra.Box>
  )
} 
