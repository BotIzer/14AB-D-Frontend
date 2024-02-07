import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./routes/Home.jsx";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page.jsx";
import Login from "./routes/Login.jsx";
import Register from "./routes/Register.jsx";
import CreatePost from "./routes/CreatePost.jsx";
import Friends from "./routes/Friends.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import UserPage from "./routes/UserPage.jsx"

// const userInfo = localStorage.getItem('userInfo')
// const userName = userInfo ? JSON.parse(userInfo).username : null
// console.log(userName)
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/login",
    element: <Login></Login>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/register",
    element: <Register></Register>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/createpost",
    element: <CreatePost></CreatePost>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/friends",
    element: <Friends></Friends>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/test",
    element: <ChatWindow></ChatWindow>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: '/user/:user',
    element: <UserPage></UserPage>,
    errorElement: <ErrorPage></ErrorPage>
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
