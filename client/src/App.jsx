import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import HomePage from './HomePage';


// function App() {
const App = () => {

  return (
    <BrowserRouter>
      <Header />    
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>   
    </BrowserRouter>
  )
}

export default App;
