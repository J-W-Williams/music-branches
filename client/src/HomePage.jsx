import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AudioRecorder } from 'react-audio-voice-recorder';


const HomePage = () => {

    const addAudioElement = async (blob) => {
        console.log("blob", blob);
    
        const formData = new FormData();
        formData.append('audio', blob);
    
        try {
            // having proxy issues, using this for testing
            // const response = await fetch('http://localhost:8000/api/upload-audio', {
            const response = await fetch('/api/upload-audio', {
                method: 'POST',
                body: formData,
                // headers: {                
                //     'Content-Type': 'audio/webm',
                //   },
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
    HomePage!
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
    </>
  )
}

export default HomePage;