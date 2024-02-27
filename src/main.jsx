import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Home from "./routes/Home.jsx";
import "./styles/index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./error-page.jsx";
import Login from "./routes/Login.jsx";
import Register from "./routes/Register.jsx";
import CreatePost from "./routes/CreatePost.jsx";
import Friends from "./routes/Friends.jsx";
import UserPage from "./routes/UserPage.jsx";
import ForumTemplate from "./components/ForumTemplate.jsx";
import Forums from "./routes/Forums.jsx";
import { io } from "socket.io-client";

const socket = io('http://localhost:3000', {
  withCredentials: true
});
export default function App(){
const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token") !== null && localStorage.getItem("userInfo") !== null);

useEffect(()=>{
setIsLoggedIn(localStorage.getItem("token") !== null && localStorage.getItem("userInfo") !== null)
if (!isLoggedIn) {
  localStorage.clear();
}
},[])
useEffect(()=> {
  socket.on('connect',()=>{
    console.log('Connected to server');
  })
  socket.on('disconnect',()=>{
    console.log('Disconnected from server');
  })
  return() =>{
    socket.disconnect();
    socket.removeAllListeners();
  }
},[])
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/login",
    element: isLoggedIn ? <Navigate to="/" /> : <Login></Login>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/register",
    element: isLoggedIn ? <Navigate to="/" /> : <Register></Register>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/createpost",
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
    path: "/test",
    element: <ForumTemplate></ForumTemplate>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/user/:user",
    element: <UserPage></UserPage>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/forums",
    element: <Forums></Forums>,
    errorElement: <ErrorPage></ErrorPage>,
  },
]);
return(
  // THIS CAUSES RERENDERING TWICE
  // DOESN'T AFFECT PRODUCTION
  // SHOULD BE FINE
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
}
ReactDOM.createRoot(document.getElementById("root")).render(
<App/>
);
