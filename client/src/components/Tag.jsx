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

`

export default Tag;