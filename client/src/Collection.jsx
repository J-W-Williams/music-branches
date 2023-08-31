import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from "styled-components";

const Collection = () => {

    const [audioResources, setAudioResources] = useState([]);
    const [itemDeleted, setItemDeleted] = useState(false);
    const [tagsInput, setTagsInput] = useState({});

    const handleTagsInputChange = (publicId, value) => {
      setTagsInput(prevState => ({
        ...prevState,
        [publicId]: value,
      }));
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


      const updateTags = async (resource) => {
        const tagsToAdd = tagsInput[resource.public_id]?.split(',').map(tag => tag.trim());
      
        console.log("hello from FE, updateTags");
        console.log("tagsToAdd:", tagsToAdd);

        // off to /api/update-tags...

        if (tagsToAdd && tagsToAdd.length > 0) {
        
          const response = await fetch('/api/update-tags', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              publicId: resource.public_id,
              tags: tagsToAdd,
            }),
          });
      
          if (response.ok) {
            // Update the state or fetch updated data from the backend
          } else {
            console.error('Failed to update tags', response.statusText);
          }
        }
      };

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
            
            <input
        type="text"
        placeholder="Add tags (comma-separated)"
        value={tagsInput[resource.public_id] || ''}
        onChange={e => handleTagsInputChange(resource.public_id, e.target.value)}
      />
      <button onClick={() => updateTags(resource)}>Update Tags</button>

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