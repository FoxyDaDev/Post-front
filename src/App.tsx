import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import NotFound from './components/NotFound';
import Dashboard from './pages/Dashboard';
import Signup from './pages/SignUp';
import Login from './pages/Login';
import MyPosts from './pages/MyPosts';
import CreatePost from './pages/CreatePost';
import Layout from './components/Layout';
import './app.css';

function PrivateRoute() {
  const [cookies] = useCookies(['auth']);
  const isAuthenticated = cookies.auth;

  return isAuthenticated ? <Outlet /> : <Navigate to="/signup" replace />;
}

function PublicRoute() {
  const [cookies] = useCookies(['auth']);
  const isAuthenticated = cookies.auth;

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        <Route element={<PrivateRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="my-posts" element={<MyPosts />} />
        </Route>

        <Route element={<PublicRoute />}>
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;