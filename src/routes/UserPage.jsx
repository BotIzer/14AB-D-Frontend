import Navigation from "../components/Navigation";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "../api/axios";
import FriendList from "../components/FriendList";
import { useEffect, useState } from "react";
import ErrorPage from "../error-page";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";
import { Button } from "react-bootstrap";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function UserPage() {
  const location = useLocation();
  const { user } = useParams(location.pathname.split("/")[2]);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([])
  const [showChat, setShowChat] = useState(false)
  const [chatId, setChatId] = useState(null)
  const [isFriend, setIsFriend] = useState(false)
  const [hasFriendRequest, setHasFriendRequest] = useState(false)
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    const GetPageDetails = async () => {
      try {
        // gets user page details, no matter who it is
        const userResponse = await axios.get(
          `/user/${user}`,
          {},
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        setUserData(userResponse.data.user)
        console.log(userResponse.data.user)
        // if the loaded user is NOT the current user, load in the chats
        if (user !== JSON.parse(localStorage.getItem("userInfo")).username) {
          const response = await axios.get('/chats', {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
          })


          // check if we have a friendly chat with them?
          if (response.data.returnArray.length != 0 && response.data.returnArray[0].friend_user_name === user) {
            
            const chatData = await axios.get(`/chat/${response.data.returnArray[0]._id}/comments`, {
              headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              withCredentials: true,
            })
            setMessages(chatData.data.comments)
            setChatId(response.data.returnArray[0]._id)
          }
          // if we aren't the user
          if (user !== JSON.parse(localStorage.getItem("userInfo")).username) {
           const friendRequests = await axios.get(
              '/user/friends/requests',
              {},
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              withCredentials: true,
              }
            );
            if (friendRequests.data.requests && friendRequests.data.requests.includes(user)) {
              setHasFriendRequest(true)
              return;
            }
            const friends = await axios.get(
              '/friends',
              {},
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              withCredentials: true,
              }
            );
            if (friends.data.some(friend => friend.username === user)) {
              setIsFriend(true)
              return;
            }
          }
        }
      } catch (err) {
        setError(err);
      }
    };
    GetPageDetails();
  }, [user]);
  useEffect(()=>{
    console.log(userData)
  },[userData])
  const SendFriendRequest = async () =>{
    try {
      await axios.post(
        `/friend/${user}`,
        {
          friendName: user,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      )
    } catch (err) {
      setError(err);
    }
  }
  if (error !== "") {
    return <ErrorPage errorStatus={error} />;
  }

  const dummyPosts = ["First post", "Lorem", "Ipsum"];
  const posts = dummyPosts.map((post) => (
    <Link key={post} className="list-group-item secondary">
      {post}
    </Link>
  ));
  return (
    <>
      <Navigation></Navigation>
      <Container>
        <Row  
          className="m-0 border" 
          style={{ height: "80vh" }}
        >
        {user !== JSON.parse(localStorage.getItem('userInfo')).username && showChat?<ChatWindow selectedChat={chatId} chatData={messages}></ChatWindow> : null} 
          <Col className="border h-100 p-0" xs={2}>
            <FriendList
            ></FriendList>
          </Col>
          <Col  
            className="border overflow-auto h-100"
          >
            <Row className="justify-content-center position-relative">
              <Image
                className="profileSize img-fluid"
                src={userData !== null ? userData.profile_image : null}
                roundedCircle
                style={{float: "center"}}
              ></Image>
            </Row>
            <Row className="justify-content-center">
              <OverlayTrigger placement="right" overlay={<Tooltip>
                {user !== JSON.parse(localStorage.getItem('userInfo')).username ? "Message" : "This is you"}</Tooltip>}>
                <Button className="text-center clear-button fs-2 primary" style={{width: "auto"}}
                onClick={()=>setShowChat(!showChat)}>{user}</Button></OverlayTrigger>
                {user !== JSON.parse(localStorage.getItem('userInfo')).username && !isFriend && !hasFriendRequest ? 
                <Button className="custom-button" 
                style={{width: 'auto', height: 'auto'}} onClick={()=>SendFriendRequest()}>
                  <Image src="/src/assets/icons/add_user_64.png" className="hover-filter-gold" />
                </Button>
                : 
                null}
                {user === JSON.parse(localStorage.getItem('userInfo')).username ? 
                <Button className="rounded-pill custom-button" 
                style={{width: 'auto', height: 'auto'}} onClick={()=>navigate(`/edituser/${user}`)}>
                  <Image src="/src/assets/icons/edit.png" className="hover-filter-gold"/>
                </Button> : null}
              <p className="text-justify secondary text-center">
                {userData !== null ? userData.description : null}
              </p>
            </Row>
            <Row className="m-0">
              <h4 className="text-center">Top posts</h4>
              <div
                data-bs-theme="dark"
                className="text-center list-group list-group-flush list-group-numbered"
              >
                {posts}
              </div>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}
