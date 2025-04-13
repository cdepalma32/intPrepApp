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


const AppRoutes = () => (
        <Routes>
            {/* Auth routes */ }
            <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} /> 
            <Route path="signup" element={<Signup />} />
            <Route path="topics" element={<Topics />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Practice routes */ }
            <Route path="practice/anagram" element={<AnagramPractice />} />
            <Route path="practice/interview" element={<InterviewPractice />} />
            <Route path="practice/leetcode" element={<LeetcodePractice />} />

            {/* Catch-all */ }
            <Route path="*" element={<NotFound />} />
            </Route>
            </Routes>
    );

    export default AppRoutes;