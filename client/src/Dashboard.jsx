import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useUserContext } from './context/UserContext';

const Dashboard = () => {

  const { loggedInUser, logout, selectedProject } = useUserContext();


  return (
    <>
    <h2>
    Dashboard!
    </h2>
    Current project: {selectedProject}
    <p>Current audio clips</p> 
    <p>Sheet music collection</p>
    <p>Artwork</p>
    </>
  )
}

export default Dashboard;