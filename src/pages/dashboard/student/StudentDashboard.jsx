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
import Communaute from "../../communauté/Communaute";
import ResourcePreviewPageWithToken from "../../resourceDetail/ResourcePreviewPageWithToken";
import ResourcePreviewPageWithId from "../../resourceDetail/ResourcePreviewPageWithId";
import { useQueryClient } from 'react-query'; // Ou le client de requête que vous utilisez
import useSyncOnConnectionRestore from "./../../../hooks/useSyncOnConnectionRestore";
import GestionDevoir from "../../gestion-devoir/GestionDevoir";
import Devoir from "../../devoir/Devoir";
import ListeEtudiants from "../../../components/liste-etudiants/ListeEtudiants";
import Progression from "../../../components/progression/Progression";
 
import Quiz from "../../quiz/quiz/Quiz";
import Quizzes from "../../quiz/quiz/Quizzes";
import Evaluation from "../../quiz/evaluation/Evaluation";


 
import HomeDashboard from "../../../components/home-dashboard/HomeDashboard";
import AssignmentList from "../../../components/assignment-list/assignmentList";
import AssignmentDetail from "../../../components/assignment-detail/assignmentDetail";
import AssignmentSubmit from "../../../components/assignment-submit/AssignmentSubmit";
import AllAssignationsDevoir from "../../../components/all-assignations-devoir/AllAssignationsDevoir";
 

export default function StudentDashboard() {

  const queryClient = useQueryClient(); // Si vous utilisez react-query, par exemple
  useSyncOnConnectionRestore(queryClient);


  return (
    <Layout>
      <Routes>
 
        {/****************************************************************************************************** */}
 
        <Route path="home"  element={<HomeDashboard />} />
        {/* ***************************************************************************************************** */}
 
        <Route path="resources" element={<Resource />} />
        <Route path="my-profile" element={<Profile />} />
        <Route path="find-profil/:id" element={<Profile />} />
        {/****************************************************************************************************** */}
        <Route path="new-resource" element={<AddResource />} />
        <Route path="update-resource/:id" element={<UpdateResource />} />
        <Route path="new-parcour" element={<AddPathwayForm />} />
        {/****************************************************************************************************** */}

        <Route
          path="update-parcour/:pathwayId"
          element={<UpdatePathwayForm />}
        />
        {/* ***************************************************************************************************** */}
        <Route path="parcours" element={<Parcours />} />
        <Route path="modules/:idParcours" element={<Module />} />
        <Route path="lessons/:idModule" element={<Lesson />} />
        {/* ***************************************************************************************************** */}
        <Route path="resource-detail/:resouceId" element={<ResourceDetail />} />
        <Route path="custom-profile" element={<CreateProfile />} />
        {/* ***************************************************************************************************** */}

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
        {/* ***************************************************************************************************** */}
        <Route path="communaute" element={<Communaute />} />
        <Route
          path="/resources/access/:token"
          element={<ResourcePreviewPageWithToken />}
        />
        <Route
          path="/resource-preview/:id"
          element={<ResourcePreviewPageWithId />}
        />
        {/* ***************************************************************************************************** */}

        {/* THIS GONNA BE FOR THE TEACHHERRRRR */}

        {/* Devoirrr  */}

        <Route
          path="/devoirs/nouveau"
          element={<GestionDevoir />}
        />
        <Route
          path="/devoirs/modifier/:id"
          element={<GestionDevoir />}
        />
        <Route path="/devoirs" element={<Devoir />} />

        {/* ***************************************************************************************************** */}

          <Route path="/quiz" element={<Quiz />} />
           <Route path="/evaluation/quiz" element={<Evaluation  />} />
          <Route path="/quizzes" element={<Quizzes />} />

        {/* LISTE ETUDIANT / GROUOPPPEE  */}

        {/* ************************************************************************************************* */}
        {/* Route pour afficher la liste des étudiants et des groupes */}
        <Route path="/etudiants" element={<ListeEtudiants />} />
        <Route path="/progression/:type/:id" element={<Progression />} />

        {/* Route pour afficher les détails d'un étudiant individuel */}
        {/* <Route path="/etudiant/:id" element={<DetailsEtudiant />} /> */}

        {/* Route pour gérer un groupe d'étudiants */}
        {/* <Route path="/groupe/:id" element={<GestionGroupe />} /> */}



        {/* Coteerr etuidant Assignment */}
                <Route path="/devoir/correction" element={<AllAssignationsDevoir />} />

                            <Route
                        path="/assignments"
                        element={<AssignmentList />}
                    />
                    <Route
                        path="/assignments/:id"
                        element={<AssignmentDetail  />}
                    />
                    <Route
                        path="/assignments/:id/submit"
                        element={<AssignmentSubmit  />}
                    />


      </Routes>
    </Layout>
  );
}
