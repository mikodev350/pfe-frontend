import React from "react";
import Layout from "../../../components/layout/Layout";
import { Route, Routes } from "react-router-dom"; // Import Routes as well
import Section from "../../section/Section";
import Resource from "../../resource/Resource";
import AddResource from "../../add-resource/AddResource";
import ResourceDetail from "../../resourceDetail/resourceDetail";

export default function StudentDashboard() {
  return (
    <Layout>
      <Routes>
        <Route path="section" element={<Section />} />
        <Route path="resource/:section" element={<Resource />} />
        <Route path="new-resource" element={<AddResource />} />
        <Route path="resource-detail/:resouceId" element={<ResourceDetail />} />


      </Routes>
    </Layout>
  );
}
