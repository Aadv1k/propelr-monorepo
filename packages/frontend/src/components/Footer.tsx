import {
  Box,
  Button,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <Button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}>
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Button>
  );
};

export default function Footer() {
  return (
    <Box
      bg="blue.200"
      color="white">
      <Container
        as={Stack}
        maxW={1400}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}>
        <Text>© 2023 Propelr. All rights reserved</Text>
        <Stack direction={'row'} spacing={6}>
          <SocialButton label={'GitHub'} href={'https://github.com/aadv1k/propelr'}>
            <i style={{fontSize: "1.5rem"}} className="bi bi-github"></i>
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
}

