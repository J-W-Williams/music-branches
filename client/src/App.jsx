import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import HomePage from './HomePage';
import Collection from './Collection';

// function App() {
const App = () => {

  return (
    <BrowserRouter>
      <Header />    
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collection" element={<Collection />} />
        </Routes>   
    </BrowserRouter>
  )
}

export default App;
