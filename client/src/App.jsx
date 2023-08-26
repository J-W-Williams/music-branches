import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import HomePage from './HomePage';


// function App() {
const App = () => {

  return (
    <BrowserRouter>
      <Header />
      {/* <Wrapper> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      {/* </Wrapper> */}
    </BrowserRouter>
  )
}

export default App;
