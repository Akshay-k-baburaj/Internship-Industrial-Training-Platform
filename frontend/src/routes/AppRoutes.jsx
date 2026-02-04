import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Auth */
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

/* Shared */
import UserProfile from "../pages/profile/UserProfile";

/* Student */
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentProfile from "../pages/student/StudentProfile";
import StudentOpportunities from "../pages/student/StudentOpportunities";
import ApplyOpportunity from "../pages/student/ApplyOpportunity";
import OpportunityDetails from "../pages/student/OpportunityDetails";
import StudentApplications from "../pages/student/StudentApplications";
import UnplacedStudents from "../pages/student/UnplacedStudents";

/* Placement */
import PlacementDashboard from "../pages/placement/PlacementDashboard";
import ManageOpportunities from "../pages/placement/ManageOpportunities";
import CreateOpportunity from "../pages/placement/CreateOpportunity";
import EditOpportunity from "../pages/placement/EditOpportunity";
import OpportunityApplications from "../pages/placement/OpportunityApplications";
import AllApplications from "../pages/placement/AllApplications";
import StudentDirectory from "../pages/placement/StudentDirectory";
import PlacementAnalytics from "../pages/placement/PlacementAnalytics";

/* Faculty */
import FacultyDashboard from "../pages/faculty/FacultyDashboard";
import PendingApprovals from "../pages/faculty/PendingApprovals";
import ReviewApplication from "../pages/faculty/ReviewApplication";
import ReviewedStudents from "../pages/faculty/ReviewedStudents";
import FacultyProfile from "../pages/faculty/FacultyProfile";
import PlacementVerification from "../pages/faculty/PlacementVerification";
import FacultyAuthGuard from "../utils/FacultyAuthGuard";

/* System */
import NotFound from "../pages/system/NotFound";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Shared */}
        <Route path="/profile" element={<UserProfile />} />

        {/* Student */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/opportunities" element={<StudentOpportunities />} />
        <Route path="/student/apply/:opportunityId" element={<ApplyOpportunity />} />
        <Route path="/student/opportunities/:id" element={<OpportunityDetails />} />
        <Route path="/student/applications" element={<StudentApplications />} />
        <Route path="/student/unplaced" element={<UnplacedStudents />} />

        {/* Placement */}
        <Route path="/placement/dashboard" element={<PlacementDashboard />} />
        <Route path="/placement/opportunities" element={<ManageOpportunities />} />
        <Route path="/placement/opportunities/create" element={<CreateOpportunity />} />
        <Route path="/placement/opportunities/edit/:id" element={<EditOpportunity />} />
        <Route path="/placement/applications" element={<AllApplications />} />
        <Route
          path="/placement/applications/:opportunityId"
          element={<OpportunityApplications />}
        />
        <Route path="/placement/students" element={<StudentDirectory />} />
        <Route path="/placement/analytics" element={<PlacementAnalytics />} />

        {/* Faculty */}
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty/profile" element={<FacultyProfile />} />
        <Route path="/faculty/pending-approvals" element={<PendingApprovals />} />
        <Route path="/faculty/reviewed-students" element={<ReviewedStudents />} />
        <Route path="/faculty/review/:applicationId" element={<ReviewApplication />} />
        <Route path="/faculty/verification" element={<PlacementVerification />} />
        <Route path="/faculty/unplaced-students" element={<UnplacedStudents />} />

        {/* Placeholder for future faculty routes */}

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
