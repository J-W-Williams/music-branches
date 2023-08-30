import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [loggedInUser, setLoggedInUser] = useState(
        localStorage.getItem('loggedInUser') || null
      );

      const [selectedProject, setSelectedProject] = useState(null);


      const [userProjects, setUserProjects] = useState({
        user1: [{ id: 1, name: 'Project 1' }, { id: 2, name: 'Project 2' }, { id: 3, name: 'Project 3' }],
        user2: [{ id: 1, name: 'Project A' }, { id: 2, name: 'Project B' }, { id: 3, name: 'Project C' }],
      });

  const login = (user) => {
    setLoggedInUser(user);
    localStorage.setItem('loggedInUser', user);
  };

  const logout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');setLoggedInUser(null);
  };

  const createProject = (user, projectName) => {
    const newProject = { id: userProjects[user].length + 1, name: projectName };
    setUserProjects((prevProjects) => ({
      ...prevProjects,
      [user]: [...prevProjects[user], newProject],
    }));
  };

  return (
    <UserContext.Provider value={{ loggedInUser, login, logout, userProjects, createProject, selectedProject,
        setSelectedProject, }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);