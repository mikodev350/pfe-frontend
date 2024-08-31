import React from "react";
import Layout from "../../../components/layout/Layout";
import { Route, Routes, Navigate } from "react-router-dom";
import Resource from "../../resource/Resource";
import AddResource from "../../add-resource/AddResource";
import ResourceDetail from "../../resourceDetail/resourceDetail";
import AddPathwayForm from "../../../components/add-parcours/AddPathwayForm";
import Parcours from "../../parcours/Parcours";
import Module from "../../module/Module";
import Lesson from "../../lesson/Lesson";
import UpdatePathwayForm from "../../../components/update-parcours/updatePathwayForm";
import UpdateResource from "../../update-resource/updateResource";
import CreateProfile from "../../create-profile/createProfile";
import ResourcePreviewPage from "../../resourcePreviewPage/ResourcePreviewPage";
import AddEducation from "../../add-education/AddEducation";
import AddExperience from "../../add-experience/AddExperience";
import DashboardProfile from "../../dashboard-profile/DashboardProfile";
import Profile from "../../Profile/Profile";
import InvitationPage from "../../Invitation-page/InvitationPage";
import ResourcePreviewPageWithToken from "../../resourceDetail/ResourcePreviewPageWithToken";
import ResourcePreviewPageWithId from "../../resourceDetail/ResourcePreviewPageWithId";
import { useQueryClient } from "react-query";
import useSyncOnConnectionRestore from "./../../../hooks/useSyncOnConnectionRestore";
import GestionDevoir from "../../gestion-devoir/GestionDevoir";
import Devoir from "../../devoir/Devoir";
import Progression from "../../../components/progression/Progression";
import Quiz from "../../quiz/quiz/Quiz";
import Quizzes from "../../quiz/quiz/Quizzes";
import Evaluation from "../../quiz/evaluation/Evaluation";
import HomeDashboard from "../../../components/home-dashboard/homeDashboard";
import AssignmentList from "../../../components/assignment-list/assignmentList";
import AssignmentDetail from "../../../components/assignment-detail/assignmentDetail";
import AssignmentSubmit from "../../../components/assignment-submit/AssignmentSubmit";
import AllAssignationsDevoir from "../../../components/all-assignations-devoir/AllAssignationsDevoir";
import CommunauteList from "../../../components/communaute-List/CommunauteList";
import ListeDesEnseignants from "../../../components/communaute-proffesseur/ListeDesEnseignants";
import AmisList from "../../../components/communaute-List/CommunauteList";
import SuiviPedagogique from "../../../components/liste-etudiants/suivi-edagogique";
import Note from "../../../components/result/Note";
import Notifications from "../../notifications/Notifications";


function Dashboard() {
  const queryClient = useQueryClient();
  useSyncOnConnectionRestore(queryClient);

  alert("Dashboard")
  const role = localStorage.getItem("role"); // Get the role from localStorage

  return (
    <Layout fullcontent={false}  backgroundColorIdentification={false}>
      <Routes>
        {/* Routes common to all users */}
        <Route path="notifications" element={<Notifications/>} />
        <Route path="home" element={<HomeDashboard />} />
        <Route path="resources" element={<Resource />} />
        <Route path="my-profile" element={<Profile />} />
        <Route path="find-profil/:id" element={<Profile />} />
        <Route path="new-resource" element={<AddResource />} />
        <Route path="update-resource/:id" element={<UpdateResource />} />
        <Route path="new-parcour" element={<AddPathwayForm />} />
        <Route
          path="update-parcour/:pathwayId"
          element={<UpdatePathwayForm />}
        />
        <Route path="parcours" element={<Parcours />} />
        <Route path="modules/:idParcours" element={<Module />} />
        <Route path="lessons/:idModule" element={<Lesson />} />
        <Route path="resource-detail/:resouceId" element={<ResourceDetail />} />
        <Route path="custom-profile" element={<CreateProfile />} />
        <Route path="edit-profile" element={<DashboardProfile />} />
        <Route path="add-education" element={<AddEducation />} />
        <Route
          path="update-education/:educationId"
          element={<AddEducation />}
        />
        <Route path="add-experience" element={<AddExperience />} />
        <Route
          path="update-experience/:experienceId"
          element={<AddExperience />}
        />
        <Route path="/communaute/invitations" element={<InvitationPage />} />

        <Route path="/communaute/amis" element={<AmisList />} />
        <Route
          path="/communaute/enseignants"
          element={<ListeDesEnseignants />}
        />
        <Route
          path="/resources/access/:token"
          element={<ResourcePreviewPageWithToken />}
        />
        <Route
          path="/resource-preview/:id"
          element={<ResourcePreviewPageWithId />}
        />
        {/* Conditional Routes based on Role */}
        {role === "TEACHER" && (
          <>
            {/* Teacher-Specific Routes */}
            <Route path="/devoirs/nouveau" element={<GestionDevoir />} />
            <Route path="/devoirs/modifier/:id" element={<GestionDevoir />} />
            <Route path="/devoirs" element={<Devoir />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/suivi-pedagogique" element={<SuiviPedagogique />} />
            <Route path="/progression/:type/:id" element={<Progression />} />
            <Route
              path="/devoir/correction"
              element={<AllAssignationsDevoir />}
            />
          </>
        )}

        {/* {role === "STUDENT" && (
          <>
            <Route
              path="/communaute/mentorat"
              element={<InvitationPage type="COACHING" />}
            />
          </>
        )} */}
        {/* <Route
          path="/communaute/mentorat"
          element={<InvitationPage type="COACHING" />}
        /> */}
        <Route path="/notes" element={<Note />} />

        <Route
          path="/communaute/coaching"
          element={<InvitationPage type="COACHING" />}
        />
        <Route path="/evaluation/quiz" element={<Evaluation />} />
        <Route path="/assignments" element={<AssignmentList />} />
        <Route path="/assignments/:id" element={<AssignmentDetail />} />
        <Route path="/assignments/:id/submit" element={<AssignmentSubmit />} />
        {/* Redirect or 404 Route */}
        <Route path="*" element={<Navigate to="/not-found" />} />
      </Routes>
    </Layout>
  );
}

export default Dashboard;
