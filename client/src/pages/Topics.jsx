// Lists all available topics
import React from 'react';

const Topics = () => {
  // Placeholder data for testing
  const topics = [
    { id: '1', name: 'JavaScript', description: 'Level 1' },
    { id: '2', name: 'React', description: 'Level 2' },
    { id: '3', name: 'Node.js', description: 'Level 3' }
  ];

  return (
    <div>
      <h2>Available Topics</h2>
      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>
            <strong>{topic.name}</strong> - {topic.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Topics;
