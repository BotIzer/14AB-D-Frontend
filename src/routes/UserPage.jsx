import Navigation from "../components/Navigation";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import FriendList from "../components/FriendList";
import { useEffect, useState } from "react";
import ErrorPage from "../error-page";
import { Link } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";
import {
  Row,
  Col,
  Container,
  Image,
  Button,
  OverlayTrigger,
  Tooltip,
  Offcanvas,
  Table
} from "react-bootstrap"

export default function UserPage() {
  const location = useLocation();
  const { user } = useParams(location.pathname.split("/")[2]);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [hasFriendRequest, setHasFriendRequest] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isSameUser, setIsSameUser] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const GetPageDetails = async () => {
      try {
        InitializeUserData();
        setIsSameUser(
          user === JSON.parse(localStorage.getItem("userInfo")).username
        );
        if (!isSameUser) {
          const response = await axios.get("/chats", {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          });
          // if we have ANY chats, we try to find the messages for the chat with the user we're viewing
          if (
            response.data.returnArray.length != 0 &&
            response.data.returnArray[0].friend_user_name === user
          ) {
            const chatData = await axios.get(
              `/chat/${response.data.returnArray[0]._id}/comments`,
              {
                headers: {
                  "Content-Type": "application/json",
                  authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                withCredentials: true,
              }
            );
            setMessages(chatData.data.comments);
            setChatId(response.data.returnArray[0]._id);
          }
          // if we aren't the user
          const friendRequests = await axios.get(
            "/user/friends/requests",
            {},
            {
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              withCredentials: true,
            }
          );
          console.log(friendRequests.data);
          const sentFriendRequests = await axios.get(
            "/user/friends/sentRequests",
            {},
            {
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              withCredentials: true,
            }
          );
          if (
            (friendRequests.data.requests &&
              friendRequests.data.requests.includes(user)) ||
            sentFriendRequests.data.sentRequests.includes(user)
          ) {
            setHasFriendRequest(true);
            return;
          }
          const friends = await axios.get(
            "/friends",
            {},
            {
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              withCredentials: true,
            }
          );
          if (friends.data.returnFriends.some((friend) => friend.username === user)) {
            setIsFriend(true);
            return;
          }
        }
      } catch (err) {
        setError(err);
      }
    };
    const InitializeUserData = async () => {
      const userResponse = await axios.get(
        `/user/${user}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setUserData(userResponse.data.user);
    };
    GetPageDetails();
  }, [user]);
  useEffect(() => {
    console.log(userData);
  }, [userData]);
  const SendFriendRequest = async () => {
    try {
      await axios.post(
        `/friend/${user}`,
        {
          friendName: user,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
    } catch (err) {
      setError(err);
    }
  };
  if (error !== "") {
    return <ErrorPage errorStatus={error} />;
  }

  const dummyPosts = ["First post", "Lorem", "Ipsum"];
  const posts = dummyPosts.map((post) => (
    <Link key={post} className="list-group-item secondary">
      {post}
    </Link>
  ));
  let hobbyList;

  if (userData !== null && userData.hobbies.length!== 0) {
     hobbyList = userData.hobbies.map((hobby,index) => (
      <th style={{ fontSize: "small" }} key={index}>
        <i className="tertiary">{hobby}</i>
      </th>
    ));
  }else {
    hobbyList = <th style={{ fontSize: "small" }}>No hobbies</th>;
  }

  
  const CloseChat = () => {
    setShowChat(false);
  }

  return (
    <>
      <Navigation></Navigation>
      <Container data-bs-theme="dark">
        <Row className="m-0 border" style={{ height: "80vh" }}>
          <Offcanvas data-bs-theme="dark" show={showChat && !isSameUser}>
            <ChatWindow
              close={CloseChat}
              type="friend"
              selectedChat={chatId}
              chatData={messages}
            ></ChatWindow>
          </Offcanvas>
          <Col className="border overflow-auto h-100">
            <Row className="justify-content-center position-relative">
              <Image
                className="profileSize img-fluid"
                src={userData !== null ? userData.profile_image : null}
                roundedCircle
                style={{ float: "center" }}
              ></Image>
            </Row>
            <Row className="justify-content-center">
              <OverlayTrigger
                placement="right"
                overlay={
                  <Tooltip>
                    {user !==
                    JSON.parse(localStorage.getItem("userInfo")).username
                      ? "Message"
                      : "This is you"}
                  </Tooltip>
                }
              >
                <Button
                  className="text-center clear-button fs-2 primary"
                  style={{ width: "auto" }}
                  onClick={() => setShowChat(!showChat)}
                >
                  {user}
                </Button>
              </OverlayTrigger>
            </Row>
            <Row className="justify-content-center">
              {!hasFriendRequest && !isFriend && !isSameUser ? (
                <Button
                  className="clear-button"
                  style={{ width: "auto", height: "auto" }}
                  onClick={() => SendFriendRequest()}
                >
                  <Image
                    src="/src/assets/icons/add_user_64.png"
                    style={{ width: "32px", height: "32px" }}
                    className="hover-filter-gold"
                  />
                </Button>
              ) : null}
              {user ===
              JSON.parse(localStorage.getItem("userInfo")).username ? (
                <Button
                  className="rounded-pill custom-button"
                  style={{ width: "auto", height: "auto" }}
                  onClick={() => navigate(`/edituser/${user}`)}
                >
                  <Image
                    src="/src/assets/icons/edit.png"
                    style={{ width: "32px", height: "32px" }}
                    className="hover-filter-gold"
                  />
                </Button>
              ) : null}
            </Row>

            <div style={{ borderTop: "3px solid #44454c" }}></div>
            <Row className="justify-content-center">
              <Table responsive className="m-0">
              <tbody>
                <tr className="text-center">{userData !== null ? hobbyList : null}</tr>
              </tbody>
              </Table>
            </Row>
            <Row>
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
