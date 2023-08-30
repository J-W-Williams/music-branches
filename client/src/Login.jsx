import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useUserContext } from './context/UserContext';

const Login = () => {
  const { login } = useUserContext();

  const handleLogin = (user) => {
    login(user);
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={() => handleLogin('user1')}>Login as User 1</button>
      <button onClick={() => handleLogin('user2')}>Login as User 2</button>
    </div>
  );
};

export default Login;
