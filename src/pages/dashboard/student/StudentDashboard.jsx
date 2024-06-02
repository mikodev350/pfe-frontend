import React from "react";
import Layout from "../../../components/layout/Layout";
import { Route, Routes } from "react-router-dom";
import Section from "../../section/Section";
import Resource from "../../resource/Resource";
import AddResource from "../../add-resource/AddResource";
import ResourceDetail from "../../resourceDetail/resourceDetail";
import AddPathwayForm from "../../../components/add-parcours/AddPathwayForm";
import Parcours from "../../parcours/Parcours";
import Module from "../../module/Module";
import Lesson from "../../lesson/Lesson";



export default function StudentDashboard() {
  return (
    <Layout>
      <Routes>
        {/* <Route path="modules" element={<Section />} /> */}
        <Route path="resource" element={<Resource />} />

        <Route path="modules" element={<Section />} />

        <Route path="new-resource" element={<AddResource />} />

        <Route path="new-parcour" element={<AddPathwayForm />} />

        <Route path="parcours" element={<Parcours />} />

        <Route path="modules/:idParcours" element={<Module />} />

        <Route path="lessons/:idModule" element={<Lesson />} />

        <Route path="resource-detail/:resouceId" element={<ResourceDetail />} />
      </Routes>
    </Layout>
  );
}
