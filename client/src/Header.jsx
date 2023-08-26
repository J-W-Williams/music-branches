import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import styled from "styled-components";

const Header = () => {


  return (
    <Wrapper>
      Header!
    </Wrapper>
  )
}

const Wrapper = styled.p`
    text-align: center;
`

export default Header;