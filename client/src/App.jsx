import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import HomePage from './HomePage';
import Collection from './Collection';
import SheetMusic from './SheetMusic';

// function App() {
const App = () => {

  return (
    <BrowserRouter>
      <Header />    
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/sheet-music" element={<SheetMusic />} />
        </Routes>   
    </BrowserRouter>
  )
}

export default App;
