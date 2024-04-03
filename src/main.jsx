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
import Forums from "./routes/Forums.jsx";
import Forum from "./routes/Forum.jsx";
import { io } from "socket.io-client";
import PostCard from "./components/PostCard.jsx";
import CreateForum from "./routes/CreateForum.jsx";
import Notifications from "./routes/Notifications.jsx"
import EditUser from "./routes/EditUser.jsx";
import EditForum from "./routes/EditForum";
import EditPost from "./routes/EditPost";
import CreateChatPopup from "./components/CreateChatPopup.jsx";
import VerifyEmail from "./routes/VerifyEmail.jsx";
import CommentAccordion from "./components/CommentAccordion.jsx";
import Comments from "./routes/Comments.jsx";
import Blacklist from "./routes/Blacklist.jsx";
import FrontPage from "./routes/FrontPage.jsx";

export default function App(){
const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token") !== null && localStorage.getItem("userInfo") !== null);
addEventListener('storage',()=>{
  setIsLoggedIn((localStorage.getItem("token") !== null && localStorage.getItem("userInfo") !== null))
})
useEffect(()=>{
  if (!isLoggedIn) {
    localStorage.clear();
  }
},[isLoggedIn])
useEffect(()=>{
if(process.env.NODE_ENV === "development"){
  const socket = io('http://localhost:3000', {
  withCredentials: true,
  query:{
    username: localStorage.getItem("userInfo") === undefined || localStorage.getItem("userInfo") === null ? null : localStorage.getItem("userInfo")
  }
});
socket.on("connect", () => {
  console.log("Connected to SOCKET.IO")
});
socket.on("disconnect", () => {
  console.log("Disconnected from SOCKET.IO")
});
socket.on('forumUpdate',(changes)=>{
  console.log(changes.updateData)
})
console.log("It is in development mode")
    return () => {
  socket.disconnect();
};
}
else{
  const ably = new Ably.Realtime({key: import.meta.env.VITE_APP_ABLY_KEY})
  console.log("It is in production mode");
return () =>{
  channel.unsubscribe();
}
}
},[])
const router = createBrowserRouter([
  {
    path: "/",
    element: isLoggedIn ? <Home></Home> : <FrontPage></FrontPage>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/login",
    element: !isLoggedIn ?  <Login></Login> : <Navigate to="/" />,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/register",
    element: !isLoggedIn ? <Register></Register> : <Navigate to="/" />,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/forums/:forumName/createpost",
    element: <CreatePost></CreatePost>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: '/chats',
    element: isLoggedIn ? <Friends></Friends> : <Navigate to="/"/>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: '/chats/:user',
    element: isLoggedIn ? <Friends></Friends> : <Navigate to="/"/>,
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
  {
    path: "/createforum",
    element: <CreateForum></CreateForum>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/forums/:forum/:forumId",
    element: <Forum></Forum>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/notifications",
    element: isLoggedIn ? <Notifications></Notifications> : <Navigate to="/"/>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/edituser/:user",
    element: isLoggedIn ? <EditUser></EditUser> : <Navigate to="/"/>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/editforum/:forum/:forumId",
    element: isLoggedIn ? <EditForum></EditForum> : <Navigate to="/"/>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/editpost/:post",
    element: isLoggedIn ? <EditPost></EditPost> : <Navigate to="/"/>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/verifyemail/:emailToken",
    element: !isLoggedIn ? <VerifyEmail></VerifyEmail> : <Navigate to="/"/>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/forums/:forum/:forumId/:postId/comments",
    element: <Comments></Comments>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "/forums/:forum/:forumId/blacklist",
    element: <Blacklist></Blacklist>,
    errorElement: <ErrorPage></ErrorPage>,
  },
  {
    path: "test",
    element: <FrontPage></FrontPage>,
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
