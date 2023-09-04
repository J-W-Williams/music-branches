import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useUserContext } from './context/UserContext';
import { styled } from 'styled-components';
import { Link } from 'react-router-dom';

const Dashboard = () => {

  const { loggedInUser, logout, selectedProject } = useUserContext();
  const [audioResources, setAudioResources] = useState([]);
  const [imageResources, setImageResources] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);


  const openModal = image => {
    setActiveImage(image);
  };

  const closeModal = () => {
    setActiveImage(null);
  }; 

  useEffect(() => {
    async function fetchResourcesAndTags() {
      try {
        
        const audioResponse = await fetch(`/api/get-audio?user=${loggedInUser}&project=${selectedProject}`);
        const imageResponse = await fetch(`/api/get-images?user=${loggedInUser}&project=${selectedProject}`);
        
        const audioData = await audioResponse.json();
        const imageData = await imageResponse.json();
        
        if (audioResponse.status === 200) {
          if (audioData.message === `No audio found for this user/project combination`) {
            setAudioResources([]);
          } else {
            setAudioResources(audioData);
          }
        } else {
          console.error('Error fetching audio resources:', audioData.message);
        }
        
        if (imageResponse.status === 200) {
          if (imageData.message === `No images found for this user/project combination`) {
            setImageResources([]);
          } else {
            setImageResources(imageData);
          }
        } else {
          console.error('Error fetching image resources:', imageData.message);
        }
        
        const tagsResponse = await fetch(`/api/get-all-tags?user=${loggedInUser}&project=${selectedProject}`);
        if (tagsResponse.ok) {
          const tagsData = await tagsResponse.json();
          setTags(tagsData);
        } else {
          console.error('Failed to fetch tags:', tagsResponse.status);
        }
      } catch (error) {
        console.error('Error fetching resources and tags:', error);
      }
    }
  
    fetchResourcesAndTags();
  }, [selectedProject, loggedInUser]);
  

  const filteredAudioResources = audioResources.length > 0
  ? audioResources.filter((resource) => resource.tags.includes(selectedTag))
  : [];

// // Filter image resources that have the selected tag
// const filteredImageResources = imageResources.filter((resource) =>
//   resource.tags.includes(selectedTag)
// );

const filteredImageResources = imageResources.length > 0
  ? imageResources.filter((resource) => resource.tags.includes(selectedTag))
  : [];

  const filterResourcesByTag = () => {

    console.log("hi")
  }
  


  return (
    <Wrapper>
    <h2>
    Dashboard!
    </h2>
    Current project: {selectedProject}
    <p><Link to="/collection">Current audio clips {audioResources.length}</Link></p> 
    <p><Link to="/sheet-music">Sheet music collection {imageResources.length}</Link></p>
    <p>Artwork</p>
    <div>
      <h2>Tag Cloud</h2>
      <div className="tag-buttons">
        {tags.map((tag) => (
          <button key={tag} onClick={() => setSelectedTag(tag)}>
            {tag}
          </button>
        ))}
      </div>
 
      {filteredImageResources.map((resource) => (
  <div key={resource.id}>
    {/* Render the image resource */}
    <Thumbnail src={resource.secure_url} alt={resource.public_id} onClick={() => openModal(resource)} />
    {/* Add other details about the image resource */}
  </div>
))}

 
      {filteredAudioResources.map((resource) => (
  <div key={resource.id}>
    {/* Render the audio resource */}
    <audio controls>
      <source src={resource.secure_url} type="audio/webm" />
    </audio>
    {/* Add other details about the audio resource */}
  </div>
))}

{activeImage && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent>
            <FullsizeImage src={activeImage.secure_url} alt={activeImage.public_id} />
          </ModalContent>
        </ModalOverlay>
      )}

    </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    background-color: #0d1117;
    height: 100%;
`

const Title = styled.div`
font-family: 'Sirin Stencil', cursive;
font-size: 34px;
color: white;
padding: 20px;
`

const Thumbnail = styled.img`
   
    height: 200px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    margin: 20px;
    transition: all ease 400ms;
    cursor: pointer;

    &:hover {
        transform: scale(1.1);
  }
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  max-width: 90%;
  max-height: 90vh;
  overflow: auto;
`;

const FullsizeImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`;
export default Dashboard;