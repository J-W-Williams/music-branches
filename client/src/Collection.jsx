import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from "styled-components";
import Tag from './components/Tag';
import TagManager from './components/TagManager';
import { useUserContext } from './context/UserContext';
import { useNavigate } from 'react-router-dom';

const Collection = () => {

    const navigate = useNavigate();
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

      const handleTranscribe = (id) => {
        
        navigate('/transcription', { state: { id } });

      };
      
      const handleChart = (id) => {
        
        navigate('/chart', { state: { id } });

      };
      

  return (
    <Wrapper>
     
      {/* <div> */}
      <Title>Your Audio Collection</Title>
      <p>{message}</p>
      
      
      {/* <div> */}
  <MainText>Sort by:{' '}</MainText>
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
{/* </div> */}




      <MyList>
        
        {sortResources(audioResources).map(resource => (
          <MyListItem key={resource.public_id}>
            <InnerList>
            <p>Date: {resource.created_at}</p>
            {/* <p>public_id: {resource.public_id}</p> */}
            <p>Duration: {resource.bytes}</p>
            </InnerList>
            <TagManager
              resource={resource}
              onUpdateTags={updateTags}
              onDeleteTag={handleDeleteTag}
              tagsInput={tagsInput} 
            />

            <MyAudio controls>
              <source src={resource.secure_url} type="audio/webm" />
            </MyAudio>
            
            <ButtonHolder>
              <MyButton onClick={() => handleTranscribe(resource.secure_url)}>Transcribe this clip</MyButton>
              <MyButton onClick={() => handleChart(resource.secure_url)}>Create chart for this clip</MyButton>
              <MyButton onClick={() => handleDestroy('video', resource.public_id)}>Delete this audio clip</MyButton>
            </ButtonHolder>
          </MyListItem>
        ))}
       
      </MyList>
     
    {/* </div> */}
    </Wrapper>
  )
}

const ButtonHolder = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

`
const InnerList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const MyAudio = styled.audio`

width: 400px;
`

const Title = styled.div`
font-family: 'Sirin Stencil', cursive;
font-size: 34px;
color: white;
padding: 20px;
`

const MainText = styled.div`
  font-family: 'Thasadith', sans-serif;
  font-size: 18px;
  color: white;
`

const SortButton = styled.button`
  /* background-color: ${({ active }) => (active ? 'lightblue' : 'white')}; */
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 5px 10px;
  margin-right: 10px;
  cursor: pointer;
  width: 80px;
  font-family: 'Thasadith', sans-serif;
  font-size: 14px;
  background-color: #1f6feb;
  color: #fbfffe; 
  border: none;
  &:hover {
    transform: scale(1.05);
    background-color: #388bfd;
  }
`

const MyButton = styled.button`
  width: 110px;
  border-radius: 5px;
  font-family: 'Thasadith', sans-serif;
  font-size: 12px;
  font-weight: 700;
  background-color: #1f6feb;
  color: #fbfffe; 
  cursor: pointer;
  transition: all ease 400ms;
  &:hover {
    transform: scale(1.05);
    background-color: #388bfd;
}
`

const TagHolder = styled.div`
  display: flex;
  flex-direction: row;
`

const MyList = styled.ul`
    list-style-type: none;  
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`

const MyListItem = styled.li`
    background-color: #22272d;
    width: 400px;
    border-radius: 30px;
    margin: 20px;
    font-family: 'Thasadith', sans-serif;
    font-weight: 700;
    color: white;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  background-color: #0d1117;
  text-decoration: none;
  padding: 20px;
  height: 100%;

`
const Line = styled.div`
    border-bottom: 1px solid black;
    padding-top: 20px;
    padding-bottom: 10px;
`

export default Collection;