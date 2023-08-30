import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from "styled-components";

const Collection = () => {

    const [audioResources, setAudioResources] = useState([]);

    useEffect(() => {
        async function fetchAudioResources() {
            try {
              const response = await fetch('/api/get-audio');
              const data = await response.json();
              setAudioResources(data);
            } catch (error) {
              console.error('Error fetching audio resources:', error);
            }
          }
          
          fetchAudioResources();
      }, []);


  const handleDestroy = (id) => {
    console.log("destroying:", id);
    // do an "are you sure?"
    // will be using this:
    // https://cloudinary.com/documentation/image_upload_api_reference#destroy_method
  }

  return (
    <Wrapper>
     
      <div>
      <h2>Audio Collection!</h2>
      <ul>
        {audioResources.map(resource => (
          <li key={resource.public_id}>
            <audio controls>
              <source src={resource.secure_url} type="audio/webm" />
            </audio>
            <p>Date: {resource.created_at}</p>
            <button onClick={() => handleDestroy(resource.public_id)}>x</button>
          </li>
        ))}
      </ul>
    </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    text-align: left;
`

export default Collection;