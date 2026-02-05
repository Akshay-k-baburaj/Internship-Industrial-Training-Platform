import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import Button from '../components/ui/Button';
import StatisticsService from '../services/statistics.service';
import OpportunityService from '../services/opportunity.service';
import ApplicationService from '../services/application.service';
import FacultyService from '../services/faculty.service';

const DashboardWrapper = styled.div`
  min-height: 100vh;
  background-color: var(--bg-primary);
  padding: 8rem 2rem 2rem; 
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 1.5rem;
`;

const WelcomeText = styled.div`
  h1 {
    font-family: 'Fira Code', monospace;
    font-size: 2rem;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    
    span {
      color: var(--accent-teal);
    }
  }
  
  p {
    color: #8892b0;
    font-family: 'Inter', sans-serif;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const DashboardCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  border: 1px solid #eee;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  
  h3 {
    font-family: 'Inter', sans-serif;
    color: #333;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.25rem;
  }
  
  p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
  
  .stat {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--accent-teal);
    margin-bottom: 0.5rem;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
  padding: 2rem;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 95%;
  max-width: 900px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  h2 {
    color: #1f2937;
    margin-bottom: 0.5rem;
    font-family: 'Fira Code', monospace;
  }

  .company-badge {
    background-color: var(--accent-teal);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
    display: inline-block;
    margin-bottom: 1rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  
  &:hover {
    color: #111827;
  }
`;

const AppList = styled.div`
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const AppCard = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;

  h4 {
    margin: 0 0 0.5rem 0;
    color: #111827;
    font-size: 1rem;
  }

  .meta {
    color: #6b7280;
    font-size: 0.9rem;
  }
`;

const ActionRow = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.75rem;
`;

const InlineInput = styled.textarea`
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  resize: vertical;
`;

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [placementStats, setPlacementStats] = useState(null);
  const [partnerCompanies, setPartnerCompanies] = useState(0);
  const [facultyProfile, setFacultyProfile] = useState(null);
  const [facultyApprovals, setFacultyApprovals] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [facultyError, setFacultyError] = useState('');
  const [approvalsOpen, setApprovalsOpen] = useState(false);
  const [remarksByApp, setRemarksByApp] = useState({});
  const [facultyDeptOpps, setFacultyDeptOpps] = useState(0);
  const [studentsSupervised, setStudentsSupervised] = useState(0);
  const [deptApplications, setDeptApplications] = useState([]);
  const [appsOpen, setAppsOpen] = useState(false);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsError, setAppsError] = useState('');
  const [appsData, setAppsData] = useState([]);
  const [studentApplicationsCount, setStudentApplicationsCount] = useState(0);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      // Fetch profile for students to check status
      if (currentUser.role === 'STUDENT' || !currentUser.role) {
        UserService.getStudentProfile(currentUser.id)
          .then(res => setProfile(res.data))
          .catch(err => console.error("Could not fetch profile for dashboard stats"));
      }
      if (currentUser.role === 'PLACEMENT_CELL') {
        StatisticsService.getPlacementCellStats(currentUser.id)
          .then(res => setPlacementStats(res.data))
          .catch(err => console.error("Could not fetch placement cell stats"));
        OpportunityService.getOpportunitiesByPlacementCell(currentUser.id)
          .then(res => {
            const companies = (res.data || [])
              .map(o => (o.companyName || '').trim())
              .filter(name => name.length > 0);
            const unique = new Set(companies.map(name => name.toLowerCase()));
            setPartnerCompanies(unique.size);
          })
          .catch(err => console.error("Could not fetch partner companies"));
      }
      if (currentUser.role === 'FACULTY') {
        FacultyService.getFacultyByUserId(currentUser.id)
          .then(res => setFacultyProfile(res.data))
          .catch(err => console.error("Could not fetch faculty profile"));
      }
    }
  }, [navigate]);

  const [studentApps, setStudentApps] = useState([]);
  const [studentAppsOpen, setStudentAppsOpen] = useState(false);

  useEffect(() => {
    if (!profile?.id || user?.role !== 'STUDENT') return;
    ApplicationService.getStudentApplications(profile.id)
      .then(res => {
        const apps = res.data || [];
        setStudentApps(apps);
        setStudentApplicationsCount(apps.length);
      })
      .catch(err => console.error("Could not fetch student applications count", err));
  }, [profile?.id, user?.role]);

  useEffect(() => {
    if (!user || user.role !== 'FACULTY') return;

    const loadFacultySummary = async () => {
      try {
        if (facultyProfile?.id) {
          const approvalsRes = await ApplicationService.getPendingFacultyApprovals(facultyProfile.id);
          setFacultyApprovals(approvalsRes.data || []);
        } else {
          setFacultyApprovals([]);
        }
      } catch (err) {
        console.error("Could not fetch faculty approvals", err);
      }

      try {
        const oppRes = await OpportunityService.getAllOpportunities();
        const allOpps = oppRes.data || [];
        const department = (facultyProfile?.department || '').trim().toLowerCase();
        if (!department) {
          setFacultyDeptOpps(0);
          return;
        }
        const count = allOpps.filter((opp) => {
          const eligible = (opp.eligibleDepartments || '').toLowerCase();
          if (!eligible || eligible.includes('all')) return true;
          return eligible.split(',').map(s => s.trim()).includes(department);
        }).length;
        setFacultyDeptOpps(count);
      } catch (err) {
        console.error("Could not fetch department opportunities", err);
      }
    };

    loadFacultySummary();
  }, [user?.role, facultyProfile?.department]);

  // Handle Placement Cell Decision (Mark Placed / Reject)
  const handlePlacementDecision = async (applicationId, isPlaced) => {
    try {
      const status = isPlaced ? 'SELECTED' : 'REJECTED';
      await ApplicationService.updateApplicationStatus(applicationId, status, user.id);

      // Refresh the list locally
      setAppsData(prev => prev.map(item => {
        if (item.application.id === applicationId) {
          return {
            ...item,
            application: { ...item.application, status: status }
          };
        }
        return item;
      }));

    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update application status.");
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <DashboardWrapper>
      <Container>
        <Header>
          <WelcomeText>
            <h1>Welcome back, <span>{user.email.split('@')[0]}</span></h1>
            <p>Role: {user.role || 'STUDENT'} • Dashboard</p>
          </WelcomeText>
          <Button variant="outline" onClick={handleLogout}>
            Sign Out
          </Button>
        </Header>

        {/* Role-Based Dashboard Content */}
        {renderDashboardContent()}

      </Container>

      {appsOpen && (
        <ModalOverlay onClick={() => setAppsOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={() => setAppsOpen(false)}>&times;</CloseButton>
            <span className="company-badge">Applications</span>
            <h2>Student Applications</h2>
            {appsLoading && <p>Loading applications...</p>}
            {appsError && <p style={{ color: 'red' }}>{appsError}</p>}

            {!appsLoading && !appsError && appsData.length === 0 && (
              <p>No applications found for your opportunities.</p>
            )}

            {!appsLoading && !appsError && appsData.length > 0 && (
              <AppList>
                {appsData.map((item) => (
                  <AppCard key={item.application.id}>
                    <h4>{item.student?.fullName || 'Student'}</h4>
                    <div className="meta">Roll No: {item.student?.rollNumber || 'N/A'}</div>
                    <div className="meta">Dept: {item.student?.department || 'N/A'}</div>
                    <div className="meta">CGPA: {item.student?.cgpa || 'N/A'}</div>
                    <div className="meta">Applied To: {item.opportunity?.title || 'Opportunity'}</div>
                    <div className="meta">Company: {item.opportunity?.companyName || 'N/A'}</div>
                    <div className="meta" style={{ marginTop: '0.5rem' }}>
                      Status: <strong style={{
                        color: item.application.status === 'SELECTED' ? '#1e40af' : item.application.status === 'REJECTED' ? '#991b1b' : (item.application.facultyApprovalStatus === 'APPROVED' ? '#065f46' : '#92400e')
                      }}>{item.application.status === 'SELECTED' ? 'Placed' : item.application.status === 'REJECTED' ? 'Rejected' : (item.application.facultyApprovalStatus === 'APPROVED' ? 'Accepted' : item.application.status)}</strong>
                    </div>
                    {item.application.status !== 'SELECTED' && item.application.status !== 'REJECTED' && (
                      <ActionRow style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                        <Button
                          variant="primary"
                          style={{ flex: 1, backgroundColor: '#10b981', borderColor: '#10b981' }}
                          onClick={() => handlePlacementDecision(item.application.id, true)}
                        >
                          Mark Placed
                        </Button>
                        <Button
                          variant="outline"
                          style={{ flex: 1, color: '#ef4444', borderColor: '#ef4444' }}
                          onClick={() => handlePlacementDecision(item.application.id, false)}
                        >
                          Mark Unplaced
                        </Button>
                      </ActionRow>
                    )}
                  </AppCard>
                ))}
              </AppList>
            )}
          </ModalContent>
        </ModalOverlay>
      )}

      {approvalsOpen && (
        <ModalOverlay onClick={() => setApprovalsOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={() => setApprovalsOpen(false)}>&times;</CloseButton>
            <span className="company-badge">Faculty</span>
            <h2>Pending Recommendations</h2>
            {facultyLoading && <p>Loading approvals...</p>}
            {facultyError && <p style={{ color: 'red' }}>{facultyError}</p>}

            {!facultyLoading && !facultyError && facultyApprovals.length === 0 && (
              <p>No pending approvals right now.</p>
            )}

            {!facultyLoading && !facultyError && facultyApprovals.length > 0 && (
              <AppList>
                {facultyApprovals.map((item) => (
                  <AppCard key={item.application.id}>
                    <h4>{item.student?.fullName || 'Student'}</h4>
                    <div className="meta">Roll No: {item.student?.rollNumber || 'N/A'}</div>
                    <div className="meta">Dept: {item.student?.department || 'N/A'}</div>
                    <div className="meta">CGPA: {item.student?.cgpa || 'N/A'}</div>
                    <div className="meta">Applied To: {item.opportunity?.title || 'Opportunity'}</div>
                    <div className="meta">Company: {item.opportunity?.companyName || 'N/A'}</div>
                    <InlineInput
                      rows="2"
                      placeholder="Remarks (optional)"
                      value={remarksByApp[item.application.id] || ''}
                      onChange={(e) => setRemarksByApp(prev => ({ ...prev, [item.application.id]: e.target.value }))}
                    />
                    <ActionRow>
                      <Button
                        variant="primary"
                        onClick={() => handleFacultyDecision(item.application.id, true)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleFacultyDecision(item.application.id, false)}
                      >
                        Reject
                      </Button>
                    </ActionRow>
                  </AppCard>
                ))}
              </AppList>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </DashboardWrapper>
  );

  // Helper function to render role-based dashboard
  function renderDashboardContent() {
    const role = user.role || 'STUDENT';

    switch (role) {
      case 'ADMIN':
        return renderAdminDashboard();
      case 'PLACEMENT_CELL':
        return renderPlacementCellDashboard();
      case 'FACULTY':
        return renderFacultyDashboard();
      case 'STUDENT':
      default:
        return renderStudentDashboard();
    }
  }



  // Analytics Modal
  function renderAnalyticsModal() {
    if (!analyticsOpen || user?.role !== 'PLACEMENT_CELL') return null;

    const stats = placementStats || {};
    const avgCgpa = stats.avgCgpa ? parseFloat(stats.avgCgpa).toFixed(2) : 'N/A';
    const uniqueStudents = stats.totalStudentsApplied || 0;
    const placed = stats.selectedStudents || 0;
    const placementRate = uniqueStudents > 0 ? ((placed / uniqueStudents) * 100).toFixed(1) : 0;

    return (
      <ModalOverlay onClick={() => setAnalyticsOpen(false)}>
        <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
          <CloseButton onClick={() => setAnalyticsOpen(false)}>&times;</CloseButton>
          <span className="company-badge" style={{ backgroundColor: '#8b5cf6' }}>Analytics</span>
          <h2>Placement Overview</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Students Placed</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                {placed} <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 'normal' }}>/ {uniqueStudents}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                {placementRate}% Placement Rate
              </div>
            </div>

            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Average CGPA</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{avgCgpa}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                Of placed students
              </div>
            </div>

            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Applications</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{stats.totalApplications || 0}</div>
            </div>

            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Active Opportunities</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#6366f1' }}>{stats.totalOpportunities || 0}</div>
            </div>
          </div>
        </ModalContent>
      </ModalOverlay>
    );
  }

  // Admin Dashboard
  function renderAdminDashboard() {
    return (
      <CardGrid>
        <DashboardCard>
          <h3>Total Users</h3>
          <div className="stat">0</div>
          <p>Registered users across all roles</p>
        </DashboardCard>

        <DashboardCard>
          <h3>Total Opportunities</h3>
          <div className="stat">0</div>
          <p>Active internship opportunities</p>
          <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/opportunities')}>
            Manage Opportunities
          </Button>
        </DashboardCard>

        <DashboardCard>
          <h3>Pending Approvals</h3>
          <div className="stat" style={{ color: '#f59e0b' }}>0</div>
          <p>Opportunities or applications awaiting review</p>
        </DashboardCard>

        <DashboardCard>
          <h3>System Activity</h3>
          <p>Recent registrations and applications will appear here.</p>
        </DashboardCard>
      </CardGrid>
    );
  }

  // Placement Cell Dashboard
  function renderPlacementCellDashboard() {
    const activeOpportunities = placementStats?.totalOpportunities ?? 0;
    const totalApplications = placementStats?.totalApplications ?? 0;

    return (
      <CardGrid>
        <DashboardCard>
          <h3>Active Opportunities</h3>
          <div className="stat">{activeOpportunities}</div>
          <p>Currently open internship positions</p>
          <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/opportunities')}>
            Post New Opportunity
          </Button>
          <Button variant="outline" style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem' }} onClick={() => setAnalyticsOpen(true)}>
            View Analytics
          </Button>
        </DashboardCard>

        <DashboardCard $clickable onClick={openApplicationsModal}>
          <h3>Total Applications</h3>
          <div className="stat">{totalApplications}</div>
          <p>Student applications received</p>
        </DashboardCard>

        <DashboardCard>
          <h3>Partner Companies</h3>
          <div className="stat">{partnerCompanies}</div>
          <p>Companies offering internships</p>
        </DashboardCard>

        <DashboardCard>
          <h3>Upcoming Deadlines</h3>
          <p>No opportunities closing soon.</p>
        </DashboardCard>
        {renderAnalyticsModal()}
      </CardGrid>
    );
  }

  // Faculty Dashboard
  function renderFacultyDashboard() {
    const pendingCount = facultyApprovals.length;

    return (
      <CardGrid>
        <DashboardCard>
          <h3>Students Supervised</h3>
          <div className="stat">{studentsSupervised}</div>
          <p>Students under your guidance</p>
          <Button variant="outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/faculty-profile')}>
            Update Profile
          </Button>
        </DashboardCard>

        <DashboardCard $clickable onClick={openFacultyApprovals}>
          <h3>Recommendations Pending</h3>
          <div className="stat" style={{ color: '#f59e0b' }}>{pendingCount}</div>
          <p>Students awaiting your recommendation</p>
        </DashboardCard>

        <DashboardCard>
          <h3>Department Opportunities</h3>
          <div className="stat">{facultyDeptOpps}</div>
          <p>Opportunities relevant to your department</p>
          <Button variant="outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/opportunities')}>
            Browse Opportunities
          </Button>
        </DashboardCard>

        <DashboardCard style={{ gridColumn: '1 / -1' }}>
          <h3>Student Activity</h3>
          {deptApplications.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              {deptApplications.slice(0, 5).map(app => (
                <div key={app.id} style={{ padding: '0.75rem', border: '1px solid #eee', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: '600', color: '#111827' }}>{app.studentName}</span>
                    <span style={{ color: '#6b7280', fontSize: '0.9rem', marginLeft: '0.5rem' }}>applied for</span>
                    <span style={{ fontWeight: '500', color: '#4b5563', marginLeft: '0.5rem' }}>{app.companyName}</span>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: (app.status === 'REJECTED' || app.facultyApprovalStatus === 'REJECTED') ? '#fee2e2' : app.status === 'SELECTED' ? '#dbeafe' : (app.status === 'APPROVED' || app.facultyApprovalStatus === 'APPROVED') ? '#d1fae5' : '#fef3c7',
                    color: (app.status === 'REJECTED' || app.facultyApprovalStatus === 'REJECTED') ? '#991b1b' : app.status === 'SELECTED' ? '#1e40af' : (app.status === 'APPROVED' || app.facultyApprovalStatus === 'APPROVED') ? '#065f46' : '#92400e'
                  }}>
                    {(app.status === 'REJECTED' || app.facultyApprovalStatus === 'REJECTED') ? 'Rejected' : app.status === 'SELECTED' ? 'Selected' : (app.status === 'APPROVED' || app.facultyApprovalStatus === 'APPROVED') ? 'Accepted' : 'Applied'}
                  </span>
                </div>
              ))}
              {deptApplications.length > 5 && <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>+ {deptApplications.length - 5} more</p>}
            </div>
          ) : (
            <p>No recent activity from your students.</p>
          )}
        </DashboardCard>
      </CardGrid>
    );
  }



  // Student Application List Modal
  function renderStudentApplicationsModal() {
    if (!studentAppsOpen || user?.role !== 'STUDENT') return null;

    return (
      <ModalOverlay onClick={() => setStudentAppsOpen(false)}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <CloseButton onClick={() => setStudentAppsOpen(false)}>&times;</CloseButton>
          <h2>My Applications</h2>
          {studentApps.length === 0 ? (
            <p>You haven't submitted any applications yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {studentApps.map(app => (
                <div key={app.id} style={{
                  padding: '1rem',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f9fafb'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#111827' }}>{app.companyName || 'Unknown Company'}</h4>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>{app.opportunityTitle || 'Internship Opportunity'}</p>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#9ca3af', fontSize: '0.8rem' }}>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '999px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      backgroundColor: (app.status === 'REJECTED' || app.facultyApprovalStatus === 'REJECTED') ? '#fee2e2' : app.status === 'SELECTED' ? '#dbeafe' : (app.status === 'APPROVED' || app.facultyApprovalStatus === 'APPROVED') ? '#d1fae5' : '#fef3c7',
                      color: (app.status === 'REJECTED' || app.facultyApprovalStatus === 'REJECTED') ? '#991b1b' : app.status === 'SELECTED' ? '#1e40af' : (app.status === 'APPROVED' || app.facultyApprovalStatus === 'APPROVED') ? '#065f46' : '#92400e'
                    }}>
                      {(app.status === 'REJECTED' || app.facultyApprovalStatus === 'REJECTED') ? 'Rejected' : app.status === 'SELECTED' ? 'Selected' : (app.status === 'APPROVED' || app.facultyApprovalStatus === 'APPROVED') ? 'Accepted' : 'Applied'}
                    </span>
                    <Button variant="outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => navigate('/opportunities')}>
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ModalContent>
      </ModalOverlay>
    );
  }

  // Student Dashboard
  function renderStudentDashboard() {
    const isProfileComplete = profile &&
      profile.department &&
      profile.department !== 'Not Specified' &&
      profile.skills &&
      profile.skills.length > 0 &&
      profile.resumeUrl &&
      profile.resumeUrl !== 'pending_upload';

    return (
      <>
        {renderStudentApplicationsModal()}
        <CardGrid>
          <DashboardCard>
            <h3>Applications</h3>
            <div className="stat">{studentApplicationsCount}</div>
            <p>
              {studentApplicationsCount > 0
                ? 'Applications submitted'
                : "You haven't submitted any internship applications yet."}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate('/opportunities')}>
                Browse
              </Button>
              {studentApplicationsCount > 0 && (
                <Button variant="outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStudentAppsOpen(true)}>
                  Track Status
                </Button>
              )}
            </div>
          </DashboardCard>

          <DashboardCard>
            <h3>Profile Status</h3>
            {isProfileComplete ? (
              <>
                <div className="stat" style={{ color: '#10b981', fontSize: '1.5rem' }}>Active</div>
                <p>Your profile is complete and ready for applications.</p>
                <Button variant="outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/profile')}>
                  View Profile
                </Button>
              </>
            ) : (
              <>
                <div className="stat" style={{ color: '#f59e0b', fontSize: '1.5rem' }}>Pending</div>
                <p>Your profile is incomplete. Please update your Department, Skills, and Resume.</p>
                <Button variant="outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/profile')}>
                  Complete Profile
                </Button>
              </>
            )}
          </DashboardCard>

          <DashboardCard>
            <h3>Upcoming Deadlines</h3>
            <p>No upcoming deadlines for your department.</p>
          </DashboardCard>
        </CardGrid>
      </>
    );
  }

  async function openApplicationsModal() {
    if (!user || user.role !== 'PLACEMENT_CELL') return;

    setAppsOpen(true);
    setAppsLoading(true);
    setAppsError('');
    setAppsData([]);
    try {
      const oppRes = await OpportunityService.getOpportunitiesByPlacementCell(user.id);
      const opportunities = oppRes.data || [];

      const appPromises = opportunities.map(async (opp) => {
        const appsRes = await ApplicationService.getApplicationsForOpportunity(opp.id);
        const apps = appsRes.data || [];
        // Use DTO fields directly instead of making extra API calls
        return apps.map(app => ({
          application: app,
          opportunity: opp,
          student: {
            fullName: app.studentName,
            rollNumber: app.studentRollNumber,
            department: app.studentDepartment,
            cgpa: app.studentCgpa
          }
        }));
      });

      const nested = await Promise.all(appPromises);
      const flat = nested.flat();

      // Filter: Only show applications that are APPROVED by Faculty
      const filtered = flat.filter(item => item.application.facultyApprovalStatus === 'APPROVED');

      setAppsData(filtered);
    } catch (err) {
      console.error("Failed to load applications", err);
      setAppsError('Failed to load applications. Please try again.');
    } finally {
      setAppsLoading(false);
    }
  }

  async function openFacultyApprovals() {
    if (!user || user.role !== 'FACULTY') return;
    if (!facultyProfile?.id) {
      setApprovalsOpen(true);
      setFacultyLoading(false);
      setFacultyError('Faculty profile not found. Please update your profile.');
      return;
    }

    setApprovalsOpen(true);
    setFacultyLoading(true);
    setFacultyError('');
    try {
      const approvalsRes = await ApplicationService.getPendingFacultyApprovals(facultyProfile.id);
      const approvals = approvalsRes.data || [];

      const enriched = await Promise.all(approvals.map(async (app) => {
        let opportunity = null;
        try {
          const oppRes = await OpportunityService.getOpportunityById(app.opportunityId);
          opportunity = oppRes.data;
        } catch (e) {
          console.error("Failed to fetch opportunity details", e);
        }

        return {
          application: app,
          // Use DTO fields for student
          student: {
            fullName: app.studentName,
            rollNumber: app.studentRollNumber,
            department: app.studentDepartment,
            cgpa: app.studentCgpa
          },
          opportunity: opportunity
        };
      }));

      setFacultyApprovals(enriched);

      // Fetch Students Supervised Count
      try {
        const studentsRes = await UserService.getStudentsByDepartment(facultyProfile.department);
        setStudentsSupervised(studentsRes.data ? studentsRes.data.length : 0);
      } catch (e) {
        console.error("Failed to fetch supervised students count", e);
      }

      // Fetch Department Applications (Student Activity)
      try {
        const deptAppsRes = await ApplicationService.getApplicationsByDepartment(facultyProfile.department);
        setDeptApplications(deptAppsRes.data || []);
      } catch (e) {
        console.error("Failed to fetch department applications", e);
      }

    } catch (err) {
      console.error("Failed to load faculty approvals", err);
      setFacultyError('Failed to load approvals. Please try again.');
    } finally {
      setFacultyLoading(false);
    }
  }

  async function handleFacultyDecision(applicationId, approved) {
    if (!facultyProfile?.id) {
      alert('Faculty profile not found. Please contact admin to create your faculty profile.');
      return;
    }

    try {
      await ApplicationService.approveByFaculty(
        applicationId,
        facultyProfile.id,
        approved,
        remarksByApp[applicationId] || ''
      );
      // Refresh list after action
      const approvalsRes = await ApplicationService.getPendingFacultyApprovals(facultyProfile?.id);
      const approvals = approvalsRes.data || [];
      const enriched = await Promise.all(approvals.map(async (app) => {
        let opportunity = null;
        try {
          const oppRes = await OpportunityService.getOpportunityById(app.opportunityId);
          opportunity = oppRes.data;
        } catch (e) {
          console.error("Failed to fetch opportunity details", e);
        }

        return {
          application: app,
          // Use DTO fields for student
          student: {
            fullName: app.studentName,
            rollNumber: app.studentRollNumber,
            department: app.studentDepartment,
            cgpa: app.studentCgpa
          },
          opportunity: opportunity
        };
      }));
      setFacultyApprovals(enriched);
      setFacultyApprovals(enriched);
    } catch (err) {
      console.error("Failed to update approval", err);
      alert('Failed to update approval. Please try again.');
    }
  }

};

export default Dashboard;
