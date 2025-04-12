import { Routes, Route } from 'react-router-dom';
import Layout from '../layouts/Layout';
import Home from '..pages/Home';
import NotFound from '../pages/NotFound';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

const AppRoutes = () => (
        <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} /> 
            <Route path="signup" element={<Signup />} />
            
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