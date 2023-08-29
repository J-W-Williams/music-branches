import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from "styled-components";

const Header = () => {


  return (
    <Wrapper>
      Music Branches
    </Wrapper>
  )
}

const Wrapper = styled.h2`
    text-align: center;
`

export default Header;