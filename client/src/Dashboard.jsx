import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useUserContext } from './context/UserContext';

const Dashboard = () => {

  const { loggedInUser, logout, selectedProject } = useUserContext();
  const [audioResources, setAudioResources] = useState([]);
  const [imageResources, setImageResources] = useState([]);

  useEffect(() => {
    async function fetchResources(resourceType, stateSetter) {
      try {
        const response = await fetch(`/api/get-${resourceType}?user=${loggedInUser}&project=${selectedProject}`);
        const data = await response.json();
        if (response.status === 200) {
          if (data.message === `No ${resourceType} found for this user/project combination`) {
            stateSetter([]);
          } else {
            stateSetter(data);
          }
        } else {
          console.error(`Error fetching ${resourceType} resources:`, data.message);
        }
      } catch (error) {
        console.error(`Error fetching ${resourceType} resources:`, error);
      }
    }
  
    fetchResources("audio", setAudioResources);
    fetchResources("images", setImageResources);
  }, [selectedProject]);
  

  // useEffect(() => {
  //   // it would be fun to be able to fling these clips around.
  //   async function fetchAudioResources() {
  //       try {
  //         const response = await fetch(`/api/get-audio?user=${loggedInUser}&project=${selectedProject}`);
  //         const data = await response.json();
  //         if (response.status === 200) {            
  //           if (data.message === 'No clips found for this user/project combination') {
  //             setAudioResources([]);
  //           } else {
  //             setAudioResources(data);
  //           }
  //         } else {           
  //           console.error('Error fetching audio resources:', data.message);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching audio resources:', error);
  //       }
  //     }      
  //     fetchAudioResources();

  //     async function fetchImageResources() {
  //       try {
  //         const response = await fetch(`/api/get-images?user=${loggedInUser}&project=${selectedProject}`);
  //         const data = await response.json();
  //         if (response.status === 200) {              
  //           if (data.message === 'No sheet music found for this user/project combination') {
  //             setImageResources([]);
  //           } else {
  //             setImageResources(data);
  //           }
  //         } else {           
  //           console.error('Error fetching audio resources:', data.message);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching resources:', error);
  //       }
  //     }      
  //     fetchImageResources();

  // }, [selectedProject]);


  return (
    <>
    <h2>
    Dashboard!
    </h2>
    Current project: {selectedProject}
    <p>Current audio clips {audioResources.length}</p> 
    <p>Sheet music collection {imageResources.length}</p>
    <p>Artwork</p>
    </>
  )
}

export default Dashboard;