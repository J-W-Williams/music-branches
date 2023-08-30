import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import HomePage from './HomePage';
import Collection from './Collection';
import SheetMusic from './SheetMusic';
import Dashboard from './Dashboard';
import Login from './Login';
import { useUserContext } from './context/UserContext';

const App = () => {

  const { loggedInUser } = useUserContext();

  return (
    <div>
      {!loggedInUser ? (
        <Login />
      ) : (
        <div>         
             <BrowserRouter>
       <Header />    
         <Routes>
           <Route path="/" element={<HomePage />} />
           <Route path="/login" element={<Login />} />
           <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/collection" element={<Collection />} />
           <Route path="/sheet-music" element={<SheetMusic />} />
          
         </Routes>   
     </BrowserRouter>
        </div>
      )}
    </div>
  );

  // return (
    
  //   <BrowserRouter>
  //     <Header />    
  //       <Routes>
  //         <Route path="/" element={<HomePage />} />
  //         <Route path="/login" element={<Login />} />
  //         <Route path="/dashboard" element={<Dashboard />} />
  //         <Route path="/collection" element={<Collection />} />
  //         <Route path="/sheet-music" element={<SheetMusic />} />
          
  //       </Routes>   
  //   </BrowserRouter>
  
  // )
}

export default App;
