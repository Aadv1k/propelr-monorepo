import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import base from "./components/chakra/base";

import Hero from "./components/Hero";
import Navbar from "./components/Navbar";


function App() {
  return (
    <div className="App">
      <ChakraProvider theme={base}>
        <Navbar />
        <Hero />
      </ChakraProvider>
    </div>
  );
}

export default App;
