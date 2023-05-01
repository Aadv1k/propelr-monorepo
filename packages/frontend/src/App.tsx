import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import base from './components/chakra/base';

import jwtDecode from "jwt-decode";

import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Products from './components/Products';
import Pricing from './components/Pricing';
import NotConvincedYet from './components/NotConvincedYet';
import Footer from './components/Footer';

import Dashboard from "./components/Dashboard";


import Register from './components/Register';
import Login from './components/Login';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { useState, useEffect, useContext} from "react" ;

import UserContext from "./context/UserContext";

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
  );
}

function RegisterPage() {
  return (
    <>
      <Navbar />
      <Register />
    </>
  );
}

function LoginPage() {
  return (
    <>
      <Navbar />
      <Login />
    </>
  );
}

function App() {
  const [globalUser, setGlobalUser] = useState({});

  useEffect(() => {
    const jwtToken = localStorage.getItem("propelrToken")
    const user: any = jwtDecode(jwtToken as string);

    if (jwtToken) {
      setGlobalUser({
        ...user,
        token: jwtToken,
      });
    }
  }, [])

  return (
    <div className="App">
      <ChakraProvider theme={base}>
        <UserContext.Provider value={[globalUser, setGlobalUser]}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      </ChakraProvider>
    </div>
  );
}

export default App;
