import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from "styled-components";
import { useUserContext } from './context/UserContext';
import { Link } from 'react-router-dom';
//import { useUserContext } from './context/UserContext';

const Header = () => {
  const { loggedInUser, logout } = useUserContext();

  return (
    <Wrapper>
      {loggedInUser && (
        <Users>
          <div>Welcome, {loggedInUser}!</div>
          <LogoutButton onClick={logout}>Logout</LogoutButton>
        </Users>
      )}
     <Title>
      Music Branches
      </Title>  
      <Navigation>
        <Link to="/"><LinkText>Audio Recorder</LinkText></Link>
        <Link to="/collection"><LinkText>Audio Collection</LinkText></Link>
        <Link to="/sheet-music"><LinkText>Sheet Music</LinkText></Link>  
      </Navigation>
    </Wrapper>
  )
}

const LogoutButton = styled.button`
  width: 110px;
`

const Users = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const LinkText = styled.div`
  padding: 5px;

`

const Title = styled.h2`
    
`
const Navigation = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`


export default Header;