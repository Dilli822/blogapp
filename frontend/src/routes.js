// Routes.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TodoList from "./components/apps/todoApp/todoList";
import Home from "./components/apps/blogApp/home/home";
import Login from "./components/apps/blogApp/auth/login";
import Signup from "./components/apps/blogApp/auth/signup";
import ForgotPassword from "./components/apps/blogApp/auth/forgot-password";
import Create from "./components/apps/blogApp/CRUD/create/create";
import Update from "./components/apps/blogApp/CRUD/update/update";
import Details from "./components/apps/blogApp/CRUD/read/details";
import Delete from "./components/apps/blogApp/CRUD/delete/delete";
import UserProfile from "./components/apps/blogApp/profile/user/profile";
import BlogList from "./components/apps/blogApp/CRUD/read/blogList";
import NewsFeed from "./components/apps/blogApp/home/newsFeed";
import PageNotFound from "./components/apps/blogApp/error/error404";
import AboutUs from "./components/apps/blogApp/about/about_us";

const MainRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/feed" element={<NewsFeed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/todoList" element={<TodoList />} />

        <Route path="/create" element={<Create />} />

        <Route path="/update/:id" element={<Update />} />

        <Route path="/details/:id" element={<Details />} />

        <Route path="public/blog/details/:id" element={<Details />} />

        <Route path="/delete" element={<Details />} />

        <Route path="/profile" element={<UserProfile />} />
        <Route path="/about" element={<AboutUs/>}/>

        <Route path="/blogs" element={<BlogList />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default MainRouter;
