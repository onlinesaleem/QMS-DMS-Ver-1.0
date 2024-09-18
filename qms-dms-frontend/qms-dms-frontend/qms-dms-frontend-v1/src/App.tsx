import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { Home } from './pages/Home';
import Dashboard from './pages/Dashboard';
import UserRegister from './pages/UserRegister';
import Login from './pages/Login';
import Logout from './pages/Logout';
import { isUserLoggedIn } from './service/AuthService';
import IncidentList from './pages/IncidentPages/IncidentList';
import IncidentAssignPage from './pages/IncidentPages/IncidentAssignPage';
import IncidentForm from './component/Incident/IncidentForm';
import IncidentFinalReportByRefId from './pages/IncidentPages/IncidentFinalReportByRefId';
import TaskResponsePage from './pages/TaskPages/TaskResponsePage';
import TaskListPage from './pages/TaskPages/TaskListPage';
import Footer from './component/layout/Footer';
import SideNavBar from './component/layout/SideNavBar';
import { Box } from '@mui/material';

import IncidentKpi from './component/Incident/IncidentKpi';
import { UserFeedbackComponent } from './component/Feedback/UserFeedbackComponent';
import QualityResponsePage from './pages/IncidentPages/QualityResponsePage';
import IncidentFinalReportGridPage from './pages/IncidentPages/IncidentFinalReportGridPage';

import ProfileComponent from './component/User/ProfileComponent';
import ProfileListPage from './component/User/ProfileListPage';
import ProfileUpdate from './component/User/ProfileUpdate';
import IncidentSubmitedFormPage from './component/Incident/IncidentSubmitedFormPage';
import GeneralTaskAssignPage from './pages/TaskPages/GeneralTaskAssignPage';
import GeneralTaskListPage from './pages/TaskPages/GeneralTaskListPage';
import TemplateList from './component/Document/TemplateList';
import TemplateForm from './component/Document/TemplateForm';
import TemplateDetails from './component/Document/TemplateDetails';
import DocumentList from './component/Document/DocumentList';
import DocumentForm from './component/Document/DocumentForm';
import DocumentDetails from './component/Document/DocumentDetails';
import DocumentDataGrid from './component/Document/DocumentDataGrid';
import ApprovalList from './component/Document/Approval/ApprovalList';
import DocumentDetailsById from './component/Document/DocumentDetailsById';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

type Props = {
  children: React.ReactNode;
};

function App() {
  function AuthenticatedRoute({ children }: Props) {
    const isAuth = isUserLoggedIn();
    if (isAuth) {
      return children;
    }
    return <Navigate to="/login" />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
        <AuthenticatedRoute>
          <Box sx={{ display: 'flex' }}>
            <SideNavBar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, minHeight: '100vh' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/incident-list" element={<IncidentList />} />
                <Route path="/incident-response" element={<IncidentFinalReportGridPage />} />
                <Route path="/incident-form" element={<IncidentForm />} />
                <Route path="/assign/:id" element={<IncidentAssignPage />} />
                <Route path="/incidentById/:incId" element={<IncidentSubmitedFormPage />} />
                <Route path="/dashboard-incident" element={<IncidentKpi />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/user-register" element={<UserRegister />} />
                <Route path="/incident-report/:incRefID" element={<IncidentFinalReportByRefId />} />
                <Route path="/task-response/:taskId" element={<TaskResponsePage />} />
                <Route path="/quality-response/:id" element={<QualityResponsePage />} />
                <Route path="/task-list" element={<TaskListPage />} />
                <Route path="/profile/:userId" element={<ProfileComponent />} />
                <Route path="/user-feeback/:taskResponseId" element={<UserFeedbackComponent />} />
                <Route path="/profile" element={<ProfileListPage />} />
                <Route path="/profile-update/:userId" element={<ProfileUpdate />} />
                <Route path="/task-assign/general" element={<GeneralTaskAssignPage/>}/>
                <Route path="/general-task-list" element={<GeneralTaskListPage/>}/>
                <Route path="/documents" element={<DocumentList/>}/>
                <Route path="/documents/update/:id" element={<DocumentList/>}/>
                <Route path="/documents/${document.id}/edit" element={<DocumentForm/>}/>
                
      {/* Your routes and other components */}
    
        <Route path="/templates" element={<TemplateList />} />
        <Route path="/templates/new" element={<TemplateForm />} />
        <Route path="/templates/:id" element={<TemplateDetails />} />
        <Route path="/documents" element={<DocumentList />} />
        <Route path="/doc-management" element={<DocumentDataGrid />} />
        <Route path="/documents/new" element={<DocumentForm />} />
        <Route path="/documents/:id" element={<DocumentDetails />} />
        <Route path="/documents/:id/edit" element={<DocumentForm />} />
        <Route path="/documents/:documentId/details" element={<DocumentDetailsById />} />
        <Route path="/documents/approval-list" element={<ApprovalList />} />
        
              </Routes>
            </Box>
          </Box>
        </AuthenticatedRoute>
      </Router>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
