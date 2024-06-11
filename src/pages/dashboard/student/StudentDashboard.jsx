import React from "react";
import Layout from "../../../components/layout/Layout";
import { Route, Routes } from "react-router-dom";
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



export default function StudentDashboard() {
  return (
    <Layout>
      <Routes>
        <Route path="resources" element={<Resource />} />
        <Route path="my-profile" element={<Profile />} />
        <Route path="find-profil/:id" element={<Profile />} />
        {/* <Route path="modules" element={<Section />} /> */}
        <Route path="new-resource" element={<AddResource />} />
        <Route path="update-resource/:id" element={<UpdateResource />} />
        <Route path="new-parcour" element={<AddPathwayForm />} />
        <Route path="resource-preview/:id" element={<ResourcePreviewPage />} />
        <Route path="update-parcour/:pathwayId" element={<UpdatePathwayForm />} />
        <Route path="parcours" element={<Parcours />} />
        <Route path="modules/:idParcours" element={<Module />} />
        <Route path="lessons/:idModule" element={<Lesson />} />

        <Route path="resource-detail/:resouceId" element={<ResourceDetail />} />
        <Route path="create-profile" element={<CreateProfile />} />


        <Route path="Dashboard-profile" element={<DashboardProfile />} />

                {/* thisss parttt iss for the teachherrrrrr  */}
     <Route path="add-education" element={<AddEducation />} />
    <Route path="update-education/:educationId" element={<AddEducation />} />
   <Route path="add-experience" element={<AddExperience />} />
   <Route path="update-experience/:experienceId" element={<AddExperience />} />




   {/* <Route path="Communauter" element={<Commu />} /> */}



      </Routes>
    </Layout>
  );
}
