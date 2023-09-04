import { useState, useEffect } from 'react'
import styled from "styled-components";
import { useUserContext } from './context/UserContext';
import { useLocation } from 'react-router-dom';

const Transcription = () => {
       
    const { state } = useLocation();
    const id = state.id;

        console.log("id:", id);
        useEffect(() => {
     
         }, []);


  return (
    <Wrapper>
     
      <div>
      <h2>Transcription!</h2>     
    </div>
            <MyAudio controls>
              <source src={id} type="audio/webm" />
            </MyAudio   >

        <FrameWrapper src="https://deft-hamster-0ad592.netlify.app/"></FrameWrapper>

    </Wrapper>
  )
}

const FrameWrapper = styled.iframe`
    width: 100%;
    height: 100vh;

`
const MyAudio = styled.audio`
    width: 100%;
     padding-bottom:10px;
`

const Wrapper = styled.div`
    text-align: left;
`
const Line = styled.div`
    border-bottom: 1px solid black;
    padding-top: 20px;
    padding-bottom: 10px;
`

export default Transcription;