import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignIn from './components/login/SignIn';
import SingUp from './components/login/SignUp';
import ForgetPassword from './components/login/ForgetPassword';
import AccountActivate from './components/login/AccountActivate';
import HomePage from './components/HomePage';
import Blog from './components/blog/Blog';
import BlogDetail from './components/blog/BlogDetail';
import LinkPage from './components/blog/LinkPage'
import { SessionProvider } from './components/SessionContext';
import './App.css'

function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<SignIn/>} />
          <Route exact path="/blog" element={<SignIn/>} />
          <Route exact path="/login" element={<SignIn/>} />
          <Route exact path="/signup" element={<SingUp/>} />
          <Route exact path='/forget-password' element={<ForgetPassword/>} />
          <Route exact path='/account-activate' element={<AccountActivate/>} />
          <Route exact path="/home" element={<HomePage/>} />
          <Route exact path='/blog/:author' element={<Blog/>}/>
          <Route exact path='/blog/:author/links' element={<LinkPage/>} />
          <Route exact path='/blog/:author/blog-detail/:blogUrl' element={<BlogDetail/>} />
        </Routes>
      </BrowserRouter>
    </SessionProvider>
  );
}

export default App;
