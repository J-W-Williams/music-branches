import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AudioRecorder } from 'react-audio-voice-recorder';
import { useUserContext } from './context/UserContext';
import { styled } from 'styled-components';

const HomePage = () => {

  const [tags, setTags] = useState('');
  const { loggedInUser, logout, selectedProject } = useUserContext();

  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };

    // upload tags will vary based on which user is loggedIn.

    const addAudioElement = async (blob) => {
        console.log("blob", blob);
        //const tags = "happy, sunny, A, 7/8";
    
        
        const formData = new FormData();
        formData.append('audio', blob);
        formData.append('tags', tags);
        formData.append('user', loggedInUser);
        formData.append('project', selectedProject);
    
        try {
          
            const response = await fetch('/api/upload-audio', {
                method: 'POST',
                body: formData,
            
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Uploaded audio successfully', data);
                // do stuff
            } else {
                console.error('Failed to upload audio', response.statusText);
            }
        } catch (error) {
            console.error('Error uploading audio', error);
        }
    };
    

  return (
    <Wrapper>
    <Title>Click the mic to record your idea!</Title>
          {/* <AudioRecorder
        onRecordingComplete={addAudioElement}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
          // autoGainControl,
          // channelCount,
          // deviceId,
          // groupId,
          // sampleRate,
          // sampleSize,
        }}
        onNotAllowedOrFound={(err) => console.table(err)}
        downloadOnSavePress={true}
        downloadFileExtension="webm"
        mediaRecorderOptions={{
          audioBitsPerSecond: 128000,
        }}
        // showVisualizer={true}
      /> */}
      <AudioRecorder
        onRecordingComplete={addAudioElement} 
        downloadOnSavePress={true}
        downloadFileExtension="webm" 
        showVisualizer={true}
      />
      <MainText>Add tags below! </MainText>
      <MainText>Not inspired right this moment?</MainText>
      <MainText>No worries</MainText>
      <MainText>You can add some or add more of them later.</MainText>
      <MyInput value={tags}
        onChange={handleTagsChange}
        placeholder="Enter tags separated by commas"></MyInput>
        

    </Wrapper>
  )
}

const MyInput = styled.textarea`
   margin-top: 20px;
   width: 440px;
   height: 80px;
   background-color: #202124;
   color: white;
   font-family: 'Thasadith', sans-serif;
   font-size: 14px;
   border-radius: 5px;
   transition: all ease 400ms;
  &:hover {
    background-color: #171b20;
  }
`

const MainText = styled.div`
  font-family: 'Thasadith', sans-serif;
  font-size: 18px;
  color: white;
  padding-top: 10px;
`

const Title = styled.div`
  
  font-family: 'Sirin Stencil', cursive;

  font-size: 34px;
  color: white;
  padding: 20px;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  background-color: #0d1117;
  text-decoration: none;
  padding: 20px;
  height: 100vh;
`

export default HomePage;