import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AudioRecorder } from 'react-audio-voice-recorder';
import { useUserContext } from './context/UserContext';

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
    <>
    <h2>Audio Recorder!</h2>
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
      />
      Add tags:
      <textarea value={tags}
        onChange={handleTagsChange}
        placeholder="Enter tags separated by commas"></textarea>
        <p>This is {loggedInUser} by the way.</p>
        <p>Working on {selectedProject}.</p>
    </>
  )
}

export default HomePage;