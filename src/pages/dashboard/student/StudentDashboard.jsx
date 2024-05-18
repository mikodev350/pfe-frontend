import React from "react";
import Layout from "../../../components/layout/Layout";
import { Route, Routes } from "react-router-dom";
import Section from "../../section/Section";
import Resource from "../../resource/Resource";
import AddResource from "../../add-resource/AddResource";
import ResourceDetail from "../../resourceDetail/resourceDetail";
import AddPathwayForm from "../../../components/add-parcours/AddPathwayForm";



export default function StudentDashboard() {
  return (
    <Layout>
      <Routes>
        <Route path="modules" element={<Section />} />
        <Route path="resource/:section" element={<Resource />} />
        <Route path="new-resource" element={<AddResource />} />
        <Route path="add-parcour" element={<AddPathwayForm />} />
        <Route path="resource-detail/:resouceId" element={<ResourceDetail />} />
      </Routes>
    </Layout>
  );
}
