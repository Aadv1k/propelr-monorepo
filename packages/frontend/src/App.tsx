import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import base from "./components/chakra/base";

import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Products from "./components/Products";
import Pricing from "./components/Pricing";
import NotConvincedYet from "./components/NotConvincedYet";
import Footer from "./components/Footer";

import Register from "./components/Register";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function IndexPage() {
  return (
    <>

          <Navbar />

            <Hero />
            <Products />
            <Pricing />
            <NotConvincedYet />
            <Footer />
            </>
  )
}

function RegisterPage() {
  return (
    <>
          <Navbar />
      <Register />
    </>
  )
}

function App() {
  return (
    <div className="App">

      <ChakraProvider theme={base}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
        </ChakraProvider>
    </div>
  );
}

export default App;
