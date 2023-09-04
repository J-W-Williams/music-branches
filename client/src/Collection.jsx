import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from "styled-components";
import Tag from './components/Tag';
import TagManager from './components/TagManager';
import { useUserContext } from './context/UserContext';

const Collection = () => {

    const [audioResources, setAudioResources] = useState([]);
    const [message, setMessage] = useState('');
    const [itemDeleted, setItemDeleted] = useState(false);
    // const [tagsInput, setTagsInput] = useState({});
    const [tagsInput, setTagsInput] = useState('');
    const [tagsList, setTagsList] = useState([]);
    const [tagDeleted, setTagDeleted] = useState(false);
    const [tagUpdated, setTagUpdated] = useState(false);
    const { loggedInUser, logout, selectedProject } = useUserContext();

    const [sortBy, setSortBy] = useState('date');
    const [sortDateOrder, setSortDateOrder] = useState('newest');
    const [sortDurationOrder, setSortDurationOrder] = useState('longest');
    


    const sortResources = (resources) => {
      return resources.slice().sort((a, b) => {
        if (sortBy === 'date') {
          if (sortDateOrder === 'newest') {
            return new Date(b.created_at) - new Date(a.created_at);
          } else if (sortDateOrder === 'oldest') {
            return new Date(a.created_at) - new Date(b.created_at);
          }
        } else if (sortBy === 'duration') {
          if (sortDurationOrder === 'shortest') {
            return a.bytes - b.bytes;
          } else if (sortDurationOrder === 'longest') {
            return b.bytes - a.bytes;
          }
        }
      });
    };
    

    
    

    const handleTagsInputChange = (publicId, value) => {
      setTagsInput(prevState => ({
        ...prevState,
        [publicId]: value,
      }));
    };

const handleDeleteTag = async (tagToDelete, id) => {
  const collectionName = 'users';
  setTagDeleted(false);
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
    }, [itemDeleted, tagsList, selectedProject, tagDeleted, tagUpdated]);

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

  
    const updateTags = async (resource, newTags) => {
      //const tagsToAdd = tagsInput[resource.public_id]?.split(',').map(tag => tag.trim());
      const collectionName = 'users'; 
      setTagUpdated(false);
      if (newTags && newTags.length > 0) {
        const response = await fetch(`/api/update-tags/${collectionName}`, { // Include the collection name in the URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            publicId: resource.public_id,
            tags: newTags,
          }),
        });
    
        if (response.ok) {
          // Update the state or fetch updated data from the backend
          console.log("tags updated.")
          setTagUpdated(true);
          //setTagsList(tagsToAdd);
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

      const handleDestroy = async (resourceType, id) => {
        console.log('destroying:', id);
        setItemDeleted(false);
        const response = await fetch(`/api/delete-resource/${resourceType}/${id}`, {
          method: 'DELETE',
        });
        console.log('response:', response);
        if (response.ok) {
          setItemDeleted(true);
        }
      };
      
      

  // const handleDestroy = async (id) => {
  //   console.log("destroying:", id);
  //   setItemDeleted(false);
  //   // do an "are you sure?"
  //   // will be using this:
  //   // https://cloudinary.com/documentation/image_upload_api_reference#destroy_method
  //   const response = await fetch(`/api/delete-audio/${id}`, {
  //     method: 'DELETE',
  //   });
  //   console.log("response:", response);
  //   if (response.ok) {
  //     setItemDeleted(true);
  //   }
  // }


  return (
    <Wrapper>
     
      <div>
      <h2>Audio Collection!</h2>
      <p>{message}</p>
      
      
      <div>
  Sort by:{' '}
  <SortButton
    onClick={() => {
      setSortBy('date');
      setSortDateOrder('newest');
    }}
    // active={sortBy === 'date' && sortDateOrder === 'newest'}
  >
    Newest
  </SortButton>
  <SortButton
    onClick={() => {
      setSortBy('date');
      setSortDateOrder('oldest');
    }}
    // active={sortBy === 'date' && sortDateOrder === 'oldest'}
  >
    Oldest
  </SortButton>
  <SortButton
    onClick={() => {
      setSortBy('duration');
      setSortDurationOrder('longest');
    }}
  >
    Longest
  </SortButton>
  <SortButton
    onClick={() => {
      setSortBy('duration');
      setSortDurationOrder('shortest');
    }}
  >
    Shortest
  </SortButton>
</div>




      <MyList>
        
        {sortResources(audioResources).map(resource => (
          <MyListItem key={resource.public_id}>
            <audio controls>
              <source src={resource.secure_url} type="audio/webm" />
            </audio>
            <p>Date: {resource.created_at}</p>
            <p>public_id: {resource.public_id}</p>
            <p>Duration: {resource.bytes}</p>
           
            <TagManager
          resource={resource}
          onUpdateTags={updateTags}
          onDeleteTag={handleDeleteTag}
          tagsInput={tagsInput} 
        />

              {/* <div>Tags (tap to delete): </div>
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
            <button onClick={() => updateTags(resource)}>Add new tags</button> */}


            Delete audio clip
            {/* <button onClick={() => handleDestroy(resource.public_id)}>x</button>  */}
            <button onClick={() => handleDestroy('video', resource.public_id)}>x</button>
         
          </MyListItem>
        ))}
       
      </MyList>
     
    </div>
    </Wrapper>
  )
}

const SortButton = styled.button`
  /* background-color: ${({ active }) => (active ? 'lightblue' : 'white')}; */
  border: 1px solid #ccc;
  padding: 5px 10px;
  margin-right: 10px;
  cursor: pointer;
`;

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