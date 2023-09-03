import { useState } from 'react';
import Tag from './Tag';

const TagManager = ({ resource, onUpdateTags, onDeleteTag }) => {
    const [tagsInput, setTagsInput] = useState('');
  
    const handleTagsInputChange = (e) => {
      setTagsInput(e.target.value);
    };
  
    const handleAddTags = () => {
      const newTags = tagsInput.split(',').map((tag) => tag.trim());
      onUpdateTags(resource, newTags); // Pass newTags only
      setTagsInput('');
    };
  
    return (
      <div>
        <div>Tags (tap to delete): </div>
        <ul>
          {resource.tags.map((tag, index) => (
            <Tag key={index} tag={tag} onDelete={() => onDeleteTag(tag, resource.public_id)} />
          ))}
        </ul>
        <input
          type="text"
          placeholder="Add tags (comma-separated)"
          value={tagsInput}
          onChange={handleTagsInputChange}
        />
        <button onClick={handleAddTags}>Add new tags</button>
      </div>
    );
  };
  

export default TagManager;
