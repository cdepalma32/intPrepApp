import { Routes, Route } from 'react-router-dom';
import Layout from '../layouts/layout';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import AnagramPractice from '../pages/practice/AnagramPractice';
import InterviewPractice from '../pages/practice/InterviewPractice';
import LeetcodePractice from '../pages/practice/LeetcodePractice';
import FlashcardsPractice from '../pages/practice/FlashcardsPractice';
import AnagramResults from '../pages/results/AnagramResults';
import Topics from '../pages/Topics';
import Dashboard from '../pages/Dashboard';
import { Navigate } from "react-router-dom";
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

      {/* 🔁 Aliases for old/bookmarked paths */}
      <Route path="signin" element={<Navigate to="/login" replace />} />
      <Route path="register" element={<Navigate to="/signup" replace />} />

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
        path="practice/flashcards"
        element={
          <PrivateRoute>
            <FlashcardsPractice />
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
        {/* Results Routes (Protected) */}
<Route
  path="results/anagram"
  element={
    <PrivateRoute>
      <AnagramResults />
    </PrivateRoute>
  }
/>
<Route
  path="results/interview"
  element={
    <PrivateRoute>
      <div className="p-6">Interview results coming soon.</div>
    </PrivateRoute>
  }
/>
<Route
  path="results/flashcards"
  element={
    <PrivateRoute>
      <div className="p-6">Flashcards results coming soon.</div>
    </PrivateRoute>
  }
/>
<Route
  path="results/leetcode"
  element={
    <PrivateRoute>
      <div className="p-6">LeetCode results coming soon.</div>
    </PrivateRoute>
  }
/>

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;