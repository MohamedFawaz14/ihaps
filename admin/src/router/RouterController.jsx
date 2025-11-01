import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Admin Pages
import LoginPage from '../components/LoginPage.jsx';
import DashboardHome from '../components/DashboardHome.jsx';
import AchievementsPage from '../components/AchievementsPage.jsx';
import InsightsPage from '../components/InsightsPage.jsx';
import ProjectsPageAdmin from '../components/ProjectsPage.jsx';
import ServicesPage from '../components/ServicesPage.jsx';
import TestimonialsPage from '../components/TestimonialsPage.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

function RouterController() {
  return (           
            <Routes>
              {/* Public Admin Route */}
              <Route path="/" element={<LoginPage />} />
    
              {/* Protected Admin Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <ProjectsPageAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/achievements"
                element={
                  <ProtectedRoute>
                    <AchievementsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/testimonials"
                element={
                  <ProtectedRoute>
                    <TestimonialsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/services"
                element={
                  <ProtectedRoute>
                    <ServicesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/insights"
                element={
                  <ProtectedRoute>
                    <InsightsPage />
                  </ProtectedRoute>
                }
              />
    
              {/* Fallback: redirect unknown /admin/* routes to login */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
  )
}

export default RouterController;