import { useState, useEffect } from 'react'
import styled from "styled-components";

const SheetMusic = () => {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleSelectFile = (e) => setFile(e.target.files[0]);
    const [tags, setTags] = useState('');
    const [imageResources, setImageResources] = useState([]);
    const [activeImage, setActiveImage] = useState(null);
  
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
          const response = await fetch('/api/get-images');
          const data = await response.json();
          setImageResources(data);
          console.log("data:", data);
        } catch (error) {
          console.error('Error fetching audio resources:', error);
        }
      }      
      fetchImageResources();
  }, []);


    const handleUpload = async () => {
        try {
          
            const formData = new FormData();
            formData.append('image', file);
            formData.append('tags', tags);

            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
            
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Uploaded image successfully', data);
                // will be using modal here to display success message
                // setImageResources(prevImageResources => [...prevImageResources, data]);

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
     <Line></Line>
            <GalleryWrapper>
      {imageResources.map(image => (
        <Thumbnail key={image.public_id} src={image.secure_url} alt={image.public_id} onClick={() => openModal(image)} />
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

const Line = styled.div`
    border-bottom: 1px solid black;
    padding-top: 10px;
    padding-bottom: 10px;
`
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

export default SheetMusic;