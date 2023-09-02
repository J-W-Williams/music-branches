import { useState } from 'react'
import { styled } from 'styled-components';

const Tag = ({ tag, onDelete }) => {
    const [showDeleteButton, setShowDeleteButton] = useState(false);
  
    const handleClick = () => {
      setShowDeleteButton(!showDeleteButton);
    };
  
    return (
      <MyButton className="tag" onClick={handleClick}>
        {tag}
        {showDeleteButton && (
          <button className="delete-button" onClick={() => onDelete(tag)}>
            X
          </button>
        )}
      </MyButton>
    );
  };

const MyButton = styled.div`
    cursor: pointer;
    border: 1px solid black;
    background: lightgrey;
    padding: 5px;
    margin: 5px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

`

export default Tag;