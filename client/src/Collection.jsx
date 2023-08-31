import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from "styled-components";

const Collection = () => {

    const [audioResources, setAudioResources] = useState([]);
    const [itemDeleted, setItemDeleted] = useState(false);
    const [tags, setTags] = useState('');
    // const { loggedInUser, logout, selectedProject } = useUserContext();
  
    const handleTagsChange = (event) => {
      setTags(event.target.value);
    };
    
    useEffect(() => {
 
        // it would be fun to be able to fling these clips around.
  
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
      }, [itemDeleted]);


  const updateTags = async (tags) => {
    console.log("hello from updateTags");
    if (tags) {
      console.log("got some new tags here:", tags);
    }
  }

  const handleDestroy = async (id) => {
    console.log("destroying:", id);
    // do an "are you sure?"
    // will be using this:
    // https://cloudinary.com/documentation/image_upload_api_reference#destroy_method
    const response = await fetch(`/api/delete-audio/${id}`, {
      method: 'DELETE',
    });
    console.log("response:", response);
    if (response.ok) {
      setItemDeleted(true);
    }
  }

  //console.log("audioResources:", audioResources);

  return (
    <Wrapper>
     
      <div>
      <h2>Audio Collection!</h2>
      <MyList>
        {audioResources.map(resource => (
          <MyListItem key={resource.public_id}>
            <audio controls>
              <source src={resource.secure_url} type="audio/webm" />
            </audio>
            <p>Date: {resource.created_at}</p>
            <p>public_id: {resource.public_id}</p>
            {/* <p>Tags: {resource.tags}</p> */}
            {/* Add tags:
              <textarea value={tags}
                onChange={handleTagsChange}
                placeholder="Enter tags separated by commas"></textarea>
                <button onClick={() => updateTags(tags)}>Add tag(s)</button> */}
            <TagHolder>
              <div>Tags:</div>
              <ul>
                {resource.tags.map((tag, index) => (
                  // <li key={index}>{tag}</li>
                  // this could be a new Component
                  // to allow for deleting itself
                  <button key={index}>{tag}</button>
                ))}
              </ul>
            </TagHolder>
            <button onClick={() => handleDestroy(resource.public_id)}>x</button>
          
          </MyListItem>
        ))}
       
      </MyList>
     
    </div>
    </Wrapper>
  )
}

const TagHolder = styled.div`
  display: flex;
  flex-direction: row;
`

const MyList = styled.ul`
    list-style-type: none;
  
`

const MyListItem = styled.li`
    background-color:lightblue;
    width: 400px;
    border-radius: 30px;
    margin: 20px;
`

const Wrapper = styled.div`
    text-align: left;

`
const Line = styled.div`
    border-bottom: 1px solid black;
    padding-top: 20px;
    padding-bottom: 10px;
`

export default Collection;