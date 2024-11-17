import { useState } from 'react';
import { Link } from 'react-router-dom';

const InterviewList = () => {
  const [activeMenu, setActiveMenu] = useState('interviews');

  return (
    <div>
      <h2 className="text-2xl text-white bg-white">Interview List</h2>
      <ul className="space-y-2 bg-white">
        <li>
          <Link
            to="/admin-dashboard/interviews"
            className={`block p-2 rounded hover:bg-white ${activeMenu === 'interviews' ? 'bg-white' : 'bg-white'}`}
            onClick={() => setActiveMenu('interviews')}
          >
            Interview List
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default InterviewList;
