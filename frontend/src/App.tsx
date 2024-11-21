import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import EditPage from './components/EditPage';
import RequestRoom from './components/RequestRoom';
import ApproveDetailPage from './components/ApproveDetailPage';
import ApprovePage from './components/ApprovePage';
import Timetable from './components/Timetable';
import Topbar from './components/TopBar'; 
import RoomInformation from './components/RoomInformation';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <div>
        <Helmet>
          <title>Laboratory Management System</title>
          <meta name="theme-color" content="#fbbf24" />
          <link rel="icon" href="/favicon.ico" />
        </Helmet>
        
        <Topbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/timetable" element={<Timetable />} />
          <Route path="/dashboard/edit-roster" element={<EditPage />} />
          <Route path="/dashboard/request-room" element={<RequestRoom />} />
          <Route path="/dashboard/approve" element={<ApprovePage />} />
          <Route path="/dashboard/approve/:id" element={<ApproveDetailPage />} />
          <Route path="/dashboard/room/:roomId" element={<RoomInformation />} />
        </Routes>
      </div>
    </HelmetProvider>
  );
};

export default App;