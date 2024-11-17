import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobPositionForm from '../components/JobPositionForm';
import JobPositionList from '../components/JobPositionList';

const CandidateInterviews = () => {
  const [jobPositions, setJobPositions] = useState([]);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const navigate = useNavigate();

  const addJobPosition = () => {
    if (newJobTitle.trim() !== '' && expireDate) {
      const newJob = {
        title: newJobTitle,
        expireDate: new Date(expireDate),
      };
      setJobPositions([...jobPositions, newJob]);
      setNewJobTitle('');
      setExpireDate('');
    }
  };

  const viewVideos = (position) => {
    navigate(`/interviews/videos/${position}`);
  };

  const deleteJobPosition = (index) => {
    const updatedPositions = jobPositions.filter((_, i) => i !== index);
    setJobPositions(updatedPositions);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setJobPositions((prevPositions) =>
        prevPositions.filter((job) => job.expireDate > now)
      );
    }, 60000); // Her dakika kontrol et

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h2 className="text-2xl text-white mb-4">Interview List</h2>
      <JobPositionForm 
        newJobTitle={newJobTitle}
        setNewJobTitle={setNewJobTitle}
        expireDate={expireDate}
        setExpireDate={setExpireDate}
        addJobPosition={addJobPosition}
      />
      <JobPositionList 
        jobPositions={jobPositions} 
        viewVideos={viewVideos} 
        deleteJobPosition={deleteJobPosition} 
      />
    </div>
  );
};

export default CandidateInterviews;
