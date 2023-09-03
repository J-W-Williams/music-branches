import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [loggedInUser, setLoggedInUser] = useState(
        localStorage.getItem('loggedInUser') || null
      );

      const [selectedProject, setSelectedProject] = useState("no project selected");

      // const [userProjects, setUserProjects] = useState({
      //   user1: [{ id: 1, name: 'Project 1' }, { id: 2, name: 'Project 2' }, { id: 3, name: 'Project 3' }],
      //   user2: [{ id: 1, name: 'Project A' }, { id: 2, name: 'Project B' }, { id: 3, name: 'Project C' }],
      // });

     const [userProjects, setUserProjects] = useState({});


      useEffect(() => {
        // Fetch user projects from MongoDB
        const fetchUserProjects = async () => {
          try {
            // fetch
            const response = await fetch('/api/get-user-projects', {
              method: 'GET',
              headers: {
                //
              },
            });
    
            if (response.ok) {
              const data = await response.json();
              setUserProjects(data);
              //localStorage.setItem('userProjects', JSON.stringify(data));
            } else {
            
              console.error('Failed to fetch user projects:', response.status);
            }
          } catch (error) {
            
            console.error('Error fetching user projects:', error);
          }
        };
    
        // Check if user projects are already cached in local storage
        // const cachedUserProjects = localStorage.getItem('userProjects');
        // if (cachedUserProjects) {
        //   setUserProjects(JSON.parse(cachedUserProjects));
        // } else {
        //   // If not cached, fetch user projects from MongoDB
          fetchUserProjects();
        //}
      }, []);


  const login = (user) => {
    setLoggedInUser(user);
    localStorage.setItem('loggedInUser', user);
  };

  const logout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');setLoggedInUser(null);
    setSelectedProject("No project selected");
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