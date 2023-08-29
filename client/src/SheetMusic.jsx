import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from "styled-components";

const SheetMusic = () => {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    //const [audioResources, setAudioResources] = useState([]);
    const handleSelectFile = (e) => setFile(e.target.files[0]);
    const [res, setRes] = useState({});
    const [tags, setTags] = useState('');
  
  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };

    const handleUpload = async () => {
        try {
          
            const formData = new FormData();
            formData.append('image', file);
            formData.append('tags', tags);

            const response = await fetch('/api/upload-image', {
            // const response = await fetch('http://localhost:8000/api/upload-image', {
                method: 'POST',
                body: formData,
            
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Uploaded image successfully', data);
                // do stuff
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
        placeholder="Enter tags separated by commas"></textarea>
          <button onClick={handleUpload} className="btn-green">
            {loading ? "uploading..." : "upload to cloudinary"}
          </button>
      {/* <div>
      <h2>Audio Collection!</h2>
      <ul>
        {audioResources.map(resource => (
          <li key={resource.public_id}>
            <audio controls>
              <source src={resource.secure_url} type="audio/webm" />
            </audio>
            <p>Date: {resource.created_at}</p>
          </li>
        ))}
      </ul>
    </div> */}
    </Wrapper>
  )
}

const Wrapper = styled.div`
    text-align: left;
`

export default SheetMusic;