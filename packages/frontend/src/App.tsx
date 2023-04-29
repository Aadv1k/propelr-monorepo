import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import base from "./components/chakra/base";

import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Products from "./components/Products";
import Pricing from "./components/Pricing";
import NotConvincedYet from "./components/NotConvincedYet";

function App() {
  return (
    <div className="App">
      <ChakraProvider theme={base}>
        <Navbar />
        <Hero />
        <Products />
        <Pricing />
        <NotConvincedYet />
      </ChakraProvider>
    </div>
  );
}

export default App;
