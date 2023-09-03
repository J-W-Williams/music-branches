import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from "styled-components";
import Tag from './components/Tag';
import { useUserContext } from './context/UserContext';

const Collection = () => {

    const [audioResources, setAudioResources] = useState([]);
    const [message, setMessage] = useState('');
    const [itemDeleted, setItemDeleted] = useState(false);
    const [tagsInput, setTagsInput] = useState({});
    const [tagsList, setTagsList] = useState([]);
    const [tagDeleted, setTagDeleted] = useState(false);
    const { loggedInUser, logout, selectedProject } = useUserContext();

    const handleTagsInputChange = (publicId, value) => {
      setTagsInput(prevState => ({
        ...prevState,
        [publicId]: value,
      }));
    };

const handleDeleteTag = async (tagToDelete, id) => {
  const collectionName = 'users';
  const response = await fetch(`/api/delete-tag/${encodeURIComponent(id)}/${encodeURIComponent(tagToDelete)}/${encodeURIComponent(collectionName)}`, {
    method: 'DELETE',
  });      
  console.log("response:", response);
  if (response.ok) {
    console.log("tag deleted");
      setTagDeleted(true);
  } else {
    // Handle error
  }
};

    // const handleDeleteTag = async (tagToDelete, id) => {
    //   const updatedTags = tagsList.filter((tag) => tag !== tagToDelete);
    //   setTagsList(updatedTags);
    //   console.log("deleting", tagToDelete);
    //   console.log("from:", id);
    //   // do an "are you sure?"   
    //   const response = await fetch(`/api/delete-tag/${encodeURIComponent(id)}/${encodeURIComponent(tagToDelete)}`, {
    //     method: 'DELETE',
    //   });      
    //   console.log("response:", response);
    //   if (response.ok) {
    //     console.log("tag deleted");
    //     setTagDeleted(true);
    //   }
    // };
   
    
    useEffect(() => {
 
      // it would be fun to be able to fling these clips around.

      async function fetchAudioResources() {
          try {
            const response = await fetch(`/api/get-audio?user=${loggedInUser}&project=${selectedProject}`);
            const data = await response.json();
            if (response.status === 200) {
              
              if (data.message === 'No clips found for this user/project combination') {
                setAudioResources([]);
                setMessage('No clips yet!');
              } else {
                setAudioResources(data);
                setMessage(''); 
              }
            } else {
              
              console.error('Error fetching audio resources:', data.message);
            }
          } catch (error) {
            console.error('Error fetching audio resources:', error);
          }
        }
        
        fetchAudioResources();
    }, [itemDeleted, tagsList, selectedProject, tagDeleted]);

    // useEffect(() => {
 
    //     // it would be fun to be able to fling these clips around.
  
    //     async function fetchAudioResources() {
    //         try {
    //           const response = await fetch('/api/get-audio');
    //           const data = await response.json();
    //           setAudioResources(data);
    //         } catch (error) {
    //           console.error('Error fetching audio resources:', error);
    //         }
    //       }
          
    //       fetchAudioResources();
    //   }, [itemDeleted, tagsList]);

  
    const updateTags = async (resource) => {
      const tagsToAdd = tagsInput[resource.public_id]?.split(',').map(tag => tag.trim());
      const collectionName = 'users'; 
          
      if (tagsToAdd && tagsToAdd.length > 0) {
        const response = await fetch(`/api/update-tags/${collectionName}`, { // Include the collection name in the URL
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
          console.log("tags updated.")
          setTagsList(tagsToAdd);
        } else {
          console.error('Failed to update tags', response.statusText);
        }
      }
    };
    

      // const updateTags = async (resource) => {
      //   const tagsToAdd = tagsInput[resource.public_id]?.split(',').map(tag => tag.trim());
      
      //     // off to /api/update-tags...

      //   if (tagsToAdd && tagsToAdd.length > 0) {
        
      //     const response = await fetch('/api/update-tags', {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify({
      //         publicId: resource.public_id,
      //         tags: tagsToAdd,
      //       }),
      //     });
      
      //     if (response.ok) {
      //       // Update the state or fetch updated data from the backend
      //       console.log("tags updated.")
      //       setTagsList(tagsToAdd);
      //     } else {
      //       console.error('Failed to update tags', response.statusText);
      //     }
      //   }
      // };

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


  return (
    <Wrapper>
     
      <div>
      <h2>Audio Collection!</h2>
      <p>{message}</p>
      <MyList>
        {audioResources.map(resource => (
          <MyListItem key={resource.public_id}>
            <audio controls>
              <source src={resource.secure_url} type="audio/webm" />
            </audio>
            <p>Date: {resource.created_at}</p>
            <p>public_id: {resource.public_id}</p>
           
              <div>Tags (tap to delete): </div>
              <ul>
              <TagHolder>
                {resource.tags.map((tag, index) => (             
                  <Tag key={index} tag={tag} onDelete={() => handleDeleteTag(tag, resource.public_id)} />
                 ))}
                 </TagHolder> 
              </ul>
                       
            <input
              type="text"
              placeholder="Add tags (comma-separated)"
              value={tagsInput[resource.public_id] || ''}
              onChange={e => handleTagsInputChange(resource.public_id, e.target.value)}
            />
            <button onClick={() => updateTags(resource)}>Add new tags</button>
            Delete audio clip
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