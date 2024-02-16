import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './routes/Home.jsx'
import './styles/index.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import ErrorPage from './error-page.jsx'
import Login from './routes/Login.jsx'
import Register from './routes/Register.jsx'
import CreatePost from './routes/CreatePost.jsx'
import Friends from './routes/Friends.jsx'
import UserPage from './routes/UserPage.jsx'
import NotifDropdown from './components/NotifDropdown.jsx'
const isLoggedIn = localStorage.getItem('token') !== null
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home></Home>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: '/login',
    element: isLoggedIn ? <Navigate to="/" /> : <Login></Login>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: '/register',
    element: isLoggedIn ? <Navigate to="/" /> : <Register></Register>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: '/createpost',
    element: <CreatePost></CreatePost>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: '/chats',
    element: <Friends></Friends>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: '/chats/:friendName',
    element: <Friends></Friends>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: '/test',
    element: <NotifDropdown></NotifDropdown>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: '/user/:user',
    element: <UserPage></UserPage>,
    errorElement: <ErrorPage></ErrorPage>,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  // THIS CAUSES RERENDERING TWICE
  // DOESN'T AFFECT PRODUCTION
  // SHOULD BE FINE
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
