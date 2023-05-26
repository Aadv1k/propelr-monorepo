import {  useMediaQuery, Box, Link, Flex, Button, useDisclosure, Input }  from "@chakra-ui/react";
import LoginGroup from "./LoginGroup";
import { Link as RouterLink } from "react-router-dom";

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'

import React from "react";

import { HamburgerIcon } from '@chakra-ui/icons'

function NavDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button variant="ghost" onClick={onOpen} rounded={4} size="md">
        <HamburgerIcon />
      </Button>

      <Drawer isOpen={isOpen} placement='right' onClose={onClose} >
        <DrawerOverlay />
        <DrawerContent bg="white.200" py={4} px={2}>
          <DrawerCloseButton />
          <DrawerBody>
          <Flex as="ul" align="start" direction="column" gap={4}>
            <Link href="/#products" color="blue.200" fontFamily="heading" fontWeight={700}>Products</Link>
            <Link href="/#pricing" color="blue.200" fontFamily="heading" fontWeight={700}>Pricing</Link>
            <Link href="/#try-it" color="blue.200" fontFamily="heading" fontWeight={700}>Try it out</Link>
          </Flex>
          </DrawerBody>

        <DrawerFooter>
        <Flex gap={2} direction="column" w="100%">
          <Button variant="solid" w="100%" borderRadius="full" size="md">Sign up</Button>
          <Button variant="outline" w="100%" borderRadius="full" size="md">Login</Button>
        </Flex>
      </DrawerFooter>

        </DrawerContent>

      </Drawer>
    </>
  )
}

export default function Navbar() {
  const [ isDesktop ] = useMediaQuery("(max-width: 800px)"); 

  return (
    <Box as="nav" w="100%" 
      px={{base: "4", lg: "8"}} 
      py={{base: "2", lg: "4"}}
      position="sticky" 
      display="flex" 
      justifyContent="space-between" alignItems="center"
      bg="white.200"

    >

      <RouterLink to="/">
        <Link color="blue.200" fontFamily="heading" fontWeight={700} fontSize={{base: "2xl", md: "3xl"}}>Propelr</Link>
      </RouterLink>

      <Flex as="ul" align="center" gap={4}>
        <Flex gap={2} ml={4}>
          <RouterLink to="/login">
            <Button as="a" variant="outline" w={32} borderRadius="full">Login</Button>
          </RouterLink>
        </Flex>
      </Flex>
    </Box>
  )

}
