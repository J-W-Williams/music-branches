import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from "styled-components";
import { useUserContext } from './context/UserContext';
import { Link } from 'react-router-dom';
//import { useUserContext } from './context/UserContext';

const Header = () => {
  const { loggedInUser, logout, createProject, userProjects, selectedProject,
    setSelectedProject } = useUserContext();
  const [newProjectName, setNewProjectName] = useState('');

  const handleNewProjectChange = (event) => {
    setNewProjectName(event.target.value);
  };

  const handleNewProjectSubmit = (event) => {
    event.preventDefault();
    if (newProjectName) {
      createProject(loggedInUser, newProjectName);
      setNewProjectName('');
    }
  };

  const handleProjectChange = (event) => {
    //console.log("event:", event);
    setSelectedProject(event.target.value);
  };

  return (
    <>
    <Wrapper>
      {loggedInUser && (
        <>
        <Users>
          <div>Welcome, {loggedInUser}!</div>
          <LogoutButton onClick={logout}>Logout</LogoutButton>   
        </Users>
        <Users>               
          {/* <div>Select project:</div>
          <select onChange={handleProjectChange}>
            {userProjects[loggedInUser].map((project) => (
              // this could also be the project.id
              // <option key={project.id} value={project.id}>
              <option key={project.id} value={project.name}>
                {project.name}
              </option>
            ))}
          </select> */}
          {/* <select onChange={handleProjectChange} defaultValue="">
              <option value="" disabled>
                Select Project
              </option>
              {userProjects[loggedInUser].map((project) => (
                <option key={project.id} value={project.name}>
                  {project.name}
                </option>
              ))}
          </select> */}
          {userProjects[loggedInUser] ? (
  <select onChange={handleProjectChange} defaultValue="">
    <option value="" disabled>
      Select Project
    </option>
    {userProjects[loggedInUser].map((project) => (
      <option key={project.id} value={project.name}>
        {project.name}
      </option>
    ))}
  </select>
) : (
  <p>Loading projects...</p>
)}


          </Users>
          <Users>
          <form onSubmit={handleNewProjectSubmit}>
            <MyInput
              type="text"
              placeholder="New"
              value={newProjectName}
              onChange={handleNewProjectChange}
            />
            <button type="submit">Create New</button>
          </form>  
        </Users>
        </>
      )}
        <Title>
          <Link to="/dashboard">Music Branches</Link>
        </Title>  
        <Navigation>
          <Link to="/"><LinkText>Audio Recorder</LinkText></Link>
          <Link to="/collection"><LinkText>Audio Collection</LinkText></Link>
          <Link to="/sheet-music"><LinkText>Sheet Music</LinkText></Link>  
        </Navigation>      
    </Wrapper>
    <Line></Line>
    </>

  )
}

const MyInput = styled.input`
  width:40px;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`
const Users = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const LogoutButton = styled.button`
  width: 110px;
`
const LinkText = styled.div`
  padding: 5px;

`

const Title = styled.h2`
    /* font-family: 'Tulpen One', cursive;
    font-size: 40px; */
`


const Navigation = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`
const Line = styled.div`
    border-bottom: 1px solid black;
    padding-top: 10px;
    padding-bottom: 10px;
`

export default Header;