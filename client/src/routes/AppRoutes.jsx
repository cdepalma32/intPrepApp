import { Routes, Route } from 'react-router-dom';
import Layout from '../layouts/layout';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import AnagramPractice from '../pages/practice/AnagramPractice';
import InterviewPractice from '../pages/practice/InterviewPractice';
import LeetcodePractice from '../pages/practice/LeetcodePractice';
import Topics from '../pages/Topics';
import Dashboard from '../pages/Dashboard';
import PrivateRoute from '../components/PrivateRoute'; 
import TestNav from "../pages/TestNav";


const AppRoutes = () => (
        <Routes>
          <Route path="/testnav" element={<TestNav />} />
                <Route path="/" element={<Layout />}>
      {/* Public Routes */}
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="topics"
        element={
          <PrivateRoute>
            <Topics />
          </PrivateRoute>
        }
      />
      <Route
        path="practice/anagram"
        element={
          <PrivateRoute>
            <AnagramPractice />
          </PrivateRoute>
        }
      />
      <Route
        path="practice/interview"
        element={
          <PrivateRoute>
            <InterviewPractice />
          </PrivateRoute>
        }
      />
      <Route
        path="practice/leetcode"
        element={
          <PrivateRoute>
            <LeetcodePractice />
          </PrivateRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;