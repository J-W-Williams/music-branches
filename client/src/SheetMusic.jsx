import { useState, useEffect } from 'react'
import styled from "styled-components";
import { useUserContext } from './context/UserContext';
import TagManager from './components/TagManager';

const SheetMusic = () => {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const handleSelectFile = (e) => setFile(e.target.files[0]);
    const [tags, setTags] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const { loggedInUser, logout, selectedProject } = useUserContext();
    const [imageResources, setImageResources] = useState([]);
    const [activeImage, setActiveImage] = useState(null);
    const [imgUploaded, setImageUploaded] = useState(false);
    const [tagDeleted, setTagDeleted] = useState(false);
    const [tagUpdated, setTagUpdated] = useState(false);
  
  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };

  const openModal = image => {
    setActiveImage(image);
  };

  const closeModal = () => {
    setActiveImage(null);
  };

  // display existing sheet music
  useEffect(() => {
    // fetch images when component mounts
    async function fetchImageResources() {
        try {
          const response = await fetch(`/api/get-images?user=${loggedInUser}&project=${selectedProject}`);
          const data = await response.json();
          if (response.status === 200) {              
            if (data.message === 'No sheet music found for this user/project combination') {
              setImageResources([]);
              setMessage('No sheet music yet!');
            } else {
              setImageResources(data);
              setMessage(''); 
            }
          } else {           
            console.error('Error fetching audio resources:', data.message);
          }
        } catch (error) {
          console.error('Error fetching resources:', error);
        }
      }      
      fetchImageResources();
  }, [selectedProject, tagDeleted, tagUpdated]);


  const handleDeleteImageTag = async (tagToDelete, id) => {
    setTagDeleted(false);
    const collectionName = 'sheets';
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
  
  const updateImageTags = async (resource, newTags) => {
    const collectionName = 'sheets';
    setTagUpdated(false);
    if (newTags && newTags.length > 0) {
      const response = await fetch(`/api/update-tags/${collectionName}`, {
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
        console.log('tags updated.');
        
        setTagsInput('');
        setTagUpdated(true);
      } else {
        console.error('Failed to update tags', response.statusText);
      }
    }
  };

    const handleUpload = async () => {
        try {
          
            const formData = new FormData();
            formData.append('image', file);
            formData.append('tags', tags);
            formData.append('user', loggedInUser);
            formData.append('project', selectedProject);

            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
            
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Uploaded image successfully', data);
                // will be using modal here to display success message
                //setImageResources(prevImageResources => [...prevImageResources, data]);
                setImageResources([...imageResources, data.cloudinaryResult]);
                //console.log("after upload, imagesResources:", imageResources);
                

            } else {
                console.error('Failed to upload image', response.statusText);
            }
        } catch (error) {
            console.error('Error uploading image', error);
        } finally {
          setLoading(false);
        }
      };

  return (
    <Wrapper>
        <h2>Sheet Music Collection!</h2>
        <p>{message}</p>
        <input
            id="file"
            type="file"
            onChange={handleSelectFile}
            multiple={false}
        />
        <textarea value={tags}
            onChange={handleTagsChange}
            placeholder="Enter tags separated by commas">
        </textarea>

        <button onClick={handleUpload} className="btn-green">
            {loading ? "uploading..." : "upload to cloudinary"}
        </button>
  
      <GalleryWrapper>
      {imageResources.map((image, index) => (
        <>
        <p>Date: {image.created_at}</p>
        <Thumbnail key={image.public_id + index} src={image.secure_url} alt={image.public_id} onClick={() => openModal(image)} />
        {/* <TagManager resource={image} onUpdateTags={updateImageTags} onDeleteTag={handleDeleteImageTag} /> */}
        {/* <TagManager resource={image} onDeleteTag={handleDeleteImageTag}   onUpdateTags={(resource, newTags) => updateImageTags(image, tagsInput, newTags)}       
        /> */}
        <TagManager
          resource={image}
          onUpdateTags={updateImageTags}
          onDeleteTag={handleDeleteImageTag}
          tagsInput={tagsInput} // Pass tagsInput to the TagManager
        />
     
        </>
      ))}
    </GalleryWrapper>

    {activeImage && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent>
            <FullsizeImage src={activeImage.secure_url} alt={activeImage.public_id} />
          </ModalContent>
        </ModalOverlay>
      )}
    </Wrapper>
  )
}

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


const GalleryWrapper = styled.div`
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    height: 100px;

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

const Wrapper = styled.div`
    text-align: left;
`

const MyListItem = styled.li`
  
`

export default SheetMusic;