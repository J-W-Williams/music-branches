import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AudioRecorder } from 'react-audio-voice-recorder';


const HomePage = () => {

    const addAudioElement = (blob) => {
        // const url = URL.createObjectURL(blob);
        // const audio = document.createElement('audio');
        // audio.src = url;
        // audio.controls = true;
        // document.body.appendChild(audio);
        console.log("blob", blob);
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