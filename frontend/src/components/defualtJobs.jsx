import React from 'react';

const DefaultJobs = () => {
  // Array of default job listings
  const jobListings = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'Tech Solutions',
      location: 'Remote',
    },
    {
      id: 2,
      title: 'Backend Developer',
      company: 'CodeCraft',
      location: 'San Francisco, CA',
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      company: 'Creative Minds',
      location: 'New York, NY',
    },
  ];

  return (
    <div style={containerStyle}>
      {jobListings.map((job) => (
        <div key={job.id} style={cardStyle}>
          <h3 style={titleStyle}>{job.title}</h3>
          <p style={textStyle}>
            <strong>Company:</strong> {job.company}
          </p>
          <p style={textStyle}>
            <strong>Location:</strong> {job.location}
          </p>
        </div>
      ))}
    </div>
  );
};

// Inline styles for the container and cards
const containerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  justifyContent: 'center',
  padding: '20px',
};

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  padding: '16px',
  width: '250px',
  backgroundColor: '#fff',
};

const titleStyle = {
  margin: '0 0 8px 0',
};

const textStyle = {
  margin: '4px 0',
};

export default DefaultJobs;
