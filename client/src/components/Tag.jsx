import { useState } from 'react'

const Tag = ({ tag, onDelete }) => {
    const [showDeleteButton, setShowDeleteButton] = useState(false);
  
    const handleClick = () => {
      setShowDeleteButton(!showDeleteButton);
    };
  
    return (
      <div className="tag" onClick={handleClick}>
        {tag}
        {showDeleteButton && (
          <button className="delete-button" onClick={() => onDelete(tag)}>
            X
          </button>
        )}
      </div>
    );
  };

export default Tag;