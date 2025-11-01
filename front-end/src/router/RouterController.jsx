import React from 'react'
import {
  BrowserRouter ,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from './../pages/HomePage.jsx';
import AboutPage from "./../pages/AboutPage.jsx";
import ProjectsPage from "./../pages/ProjectsPage.jsx";
import ProjectDetailsPage from "./../pages/ProjectDetailsPage.jsx";
import BlogPage from "./../pages/BlogPage.jsx";
import GalleryPage from "./../pages/GalleryPage.jsx";
import ContactForm from "./../components/client/ContactForm.jsx";

function RouterController() {
  return (
   <Routes>
        {/* === Frontend Routes === */}
        <Route path="/" element={<HomePage />}/>
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/project/:id" element={<ProjectDetailsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/enquiry" element={<ContactForm />} />
        <Route path="/preview_page.html" element={<Navigate to="/" replace />} />  
        <Route path="*" element={<Navigate to="/" replace />} />  
      </Routes>
  )
}

export default RouterController