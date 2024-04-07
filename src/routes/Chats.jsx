import Navigation from "../components/Navigation";
import FriendPopupActions from "../components/FriendPopupActions";
import CreateChatPopup from "../components/CreateChatPopup";
import { useEffect, useState } from "react";
import ChatWindow from "../components/ChatWindow";
import axios from "../api/axios";
import ErrorPage from "../error-page";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Row, Col, Image, Pagination, Nav, Tab } from "react-bootstrap";

function Friends() {
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [props, setProps] = useState({
    selectedChat: null,
    selectedFriend: null,
    selectedChatType: null,
    displayName: "",
  });
  const [showData, setShowData] = useState({
    showChat: false,
    showPopup: false,
    showCreateChat: false,
    lastAction: null,
  });
  const location = useLocation();
  const [pageDetails, setPageDetails] = useState({
    currentPage: parseInt(location.search.split("page=")[1]) || 0,
    limit: parseInt(location.search.split("limit=")[1]) || 10,
  });
  const [owners, setOwners] = useState({});
  const [users, setUsers] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const GetFriends = async () => {
      if (!localStorage.getItem("token")) {
        setError({
          response: {
            data: { message: "You need to login to access this page!" },
          },
        });
        return;
      }
      try {
        const response = await axios.get("/chats", {
          params: {
            page: pageDetails.currentPage,
            limit: pageDetails.limit,
          },
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });
        if (response.data.returnArray) {
          if (response.data.returnArray) {
            console.log(response.data.returnArray);
            setFriends(
              [...Object.values(response.data.returnArray)].filter(
                (x) => x.is_private
              )
            );
            setGroups(
              [...Object.values(response.data.returnArray)].filter(
                (x) => !x.is_private
              )
            );
          }
        }
      } catch (err) {
        setError(err);
      }
    };
    GetFriends();
  }, []);
  useEffect(() => {
    const SetOwner = async () => {
      let chatOwner = {};
      let chatUsers = {};
      for (let index = 0; index < groups.length; index++) {
        const response = await axios.get(`/chat/${groups[index]._id}`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });
        chatUsers = { ...users, [groups[index]._id]: response.data.chat.users };
        chatOwner = {
          ...chatOwner,
          [groups[index]._id]: response.data.chat.owner,
        };
      }
      setOwners(chatOwner);
      setUsers(chatUsers);
    };
    SetOwner();
  }, [groups]);
  const ShowChat = (action) => {
    setShowData({
      showChat: true,
      showPopup: false,
      showCreateChat: false,
      lastAction: action,
    });
  };
  const ShowPopup = (action) => {
    setShowData({
      showChat: false,
      showPopup: true,
      showCreateChat: false,
      lastAction: action,
    });
  };
  const ShowCreate = () => {
    setShowData({ showChat: false, showPopup: false, showCreateChat: true });
  };
  const DoNotShow = () => {
    setShowData({ showChat: false, showPopup: false, showCreateChat: false });
  };
  const ClearProps = () => {
    setProps({
      selectedChat: null,
      selectedFriend: null,
      selectedChatType: null,
      displayName: "",
      owner: "",
    });
  };
  if (error != "") {
    return <ErrorPage errorStatus={error} />;
  }

  const friendList = friends.map((chat) => (
    <Row key={chat._id} className="m-0">
      <Button
        className=" secondary clear-button m-0"
        onContextMenu={(e) => {
          e.preventDefault();
          if (
            props.selectedChat == chat._id &&
            showData.lastAction === "context"
          ) {
            DoNotShow();
            ClearProps();
          } else {
            ShowPopup("context");
            setProps({
              selectedChat: chat._id,
              selectedChatType: "friend",
              displayName: chat.friend_user_name,
            });
          }
          setProps((prevProps) => ({
            ...prevProps,
            selectedFriend: chat.friend_user_name,
          }));
        }}
        onClick={async (e) => {
          e.preventDefault();
          if (
            props.selectedChat == chat._id &&
            showData.lastAction === "click"
          ) {
            DoNotShow();
            ClearProps();
            return;
          }
          const chatData = await axios.get(`/chat/${chat._id}/comments`, {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          });
          setProps((prevProps) => ({
            ...prevProps,
            selectedChat: chat._id,
            selectedChatType: "friend",
          }));
          setComments(chatData.data.comments);
          ShowChat("click");
          navigate(`/chats/${chat.friend_user_name}`);
        }}
      >
        {chat.friend_user_name}
      </Button>
    </Row>
  ));

  const groupList = groups.map((chat) => (
    <Row key={chat._id} className="m-0">
      <Button
        className="secondary clear-button m-0 px-0"
        onContextMenu={(e) => {
          e.preventDefault();
          if (
            props.selectedChat == chat._id &&
            showData.lastAction === "context"
          ) {
            DoNotShow();
            ClearProps();
          } else {
            ShowPopup("context");
            setProps({
              selectedFriend: null,
              selectedChat: chat._id,
              selectedChatType: "group",
              displayName: chat.name,
            });
          }
        }}
        onClick={async (e) => {
          e.preventDefault();
          if (
            props.selectedChat == chat._id &&
            showData.lastAction === "click"
          ) {
            DoNotShow();
            ClearProps();
            return;
          }
          const chatData = await axios.get(`/chat/${chat._id}/comments`, {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          });
          setProps({
            selectedFriend: null,
            selectedChat: chat._id,
            selectedChatType: "group",
            displayName: chat.name,
          });
          setComments(chatData.data.comments);
          ShowChat("click");
          navigate(`/chats/${chat.name}`);
        }}
      >
        {chat.name}
      </Button>
    </Row>
  ));

  //TODO connect to backend, make active page dynamic
  let pages = [];
  let pagesCount = 20;
  let active = 20;
  for (let i = 1; i <= pagesCount; i++) {
    pages.push(
      <Pagination.Item key={i} active={i === active}>
        {i}
      </Pagination.Item>
    );
  }

  return (
    <>
      <Navigation></Navigation>
      <Tab.Container defaultActiveKey="chats">
        <Tab.Content>
          <Tab.Pane eventKey="chats">
            <Row className="w-100 h-50 m-0">
              <Col
                data-bs-theme="dark"
                className="m-0 p-0  text-center custom-border"
                style={{ maxHeight: "80vh", maxWidth: "50vw" }}
              >
                <Row className="m-0 pt-2">
                  <h5>Direct messages</h5>
                  <div className="border"></div>
                  {friends.length == 0 ? <i>No friends?</i> : null}
                  <Col className="overflow-auto">
                    {friendList}
                    {/*TODO create seperate variable for dms*/}
                    <Pagination className="justify-content-center p-0 m-0 custom-pagination">
                      <Pagination.Prev />
                      {pages[active - 1]}
                      <Pagination.Next />
                    </Pagination>{" "}
                    {/* TODO: Connect pagination to backend*/}
                  </Col>
                </Row>
                <div className="border"></div>
                <Row className="m-0 p-0 pt-2">
                  <h5>Groups</h5>
                  <div className="border"></div>
                  {groups.length == 0 ? <i>No groups?</i> : null}
                  <Col style={{ maxHeight: "30vh" }} className="overflow-auto">
                    {groupList}
                    <Row>
                      <Pagination className="justify-content-center p-0 m-0 custom-pagination">
                        <Pagination.Prev />
                        {pages[active - 1]}
                        <Pagination.Next />
                      </Pagination>{" "}
                      {/* TODO: Connect pagination to backend*/}
                    </Row>
                  </Col>
                  <Button
                    variant="outline-warning"
                    onMouseEnter={() =>
                      (document.getElementById("addGroup").className =
                        "filter-black")
                    }
                    onMouseLeave={() =>
                      (document.getElementById("addGroup").className =
                        "filter-gold")
                    }
                  >
                    <div onClick={() => ShowCreate()}>
                      <b>+</b>{" "}
                      <Image
                        id="addGroup"
                        className="filter-gold"
                        src="/src/assets/icons/group.png"
                      />
                    </div>
                  </Button>
                </Row>
              </Col>
              <Col className="m-0 p-0" style={{ maxWidth: "50vw" }}>
                {showData.showPopup ? (
                  <FriendPopupActions
                    users={users}
                    owners={owners}
                    selectedChat={props.selectedChat}
                    name={props.displayName}
                    type={props.selectedChatType}
                    friend={props.selectedFriend}
                  />
                ) : null}
                {showData.showChat ? (
                  <ChatWindow
                    close={() => DoNotShow()}
                    type={props.selectedChatType}
                    chatData={comments}
                    selectedChat={props.selectedChat}
                  />
                ) : null}
                {showData.showCreateChat ? (
                  <CreateChatPopup
                    close={() => DoNotShow()}
                    friends={friends}
                  />
                ) : null}
              </Col>
            </Row>
          </Tab.Pane>
          <Tab.Pane eventKey="friends">
            <Row className="w-100 h-50 m-0">
              <Col
                data-bs-theme="dark"
                className="m-0 p-0  text-center custom-border"
                style={{ maxHeight: "80vh", maxWidth: "50vw" }}
              >
                <Row className="m-0 pt-2">
                  <h5>Friends</h5>
                  <div className="border"></div>
                  {friends.length == 0 ? <i>No friends?</i> : null}
                  <Col className="overflow-auto">
                    {friendList}
                    {/* TODO create seperate variable for all friends and dms */}
                    <Pagination className="justify-content-center p-0 m-0 custom-pagination">
                      <Pagination.Prev />
                      {pages[active - 1]}
                      <Pagination.Next />
                    </Pagination>{" "}
                    {/* TODO: Connect pagination to backend*/}
                  </Col>
                </Row>
                <div className="border"></div>
              </Col>
              <Col className="m-0 p-0" style={{ maxHeight: "80vh", maxWidth: "50vw"}}>
                  {showData.showPopup ? (
                    <FriendPopupActions
                      users={users}
                      owners={owners}
                      selectedChat={props.selectedChat}
                      name={props.displayName}
                      type={props.selectedChatType}
                      friend={props.selectedFriend}
                    />
                  ) : null}
                  {showData.showChat ? (
                    <ChatWindow
                      close={() => DoNotShow()}
                      type={props.selectedChatType}
                      chatData={comments}
                      selectedChat={props.selectedChat}
                    />
                  ) : null}
                </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>
        <Nav
          className="fixed-bottom justify-content-center"
          style={{ backgroundColor: "#343a40" }}
        >
          <Col>
            <Row className="justify-content-center">
              <Col
                className="text-center p-0"
                style={{ maxWidth: "fit-content" }}
              >
                <Nav.Item>
                  <Nav.Link className="custom-tab secondary" eventKey="chats">
                    Chats
                  </Nav.Link>
                </Nav.Item>
              </Col>
              <Col
                className="text-center p-0"
                style={{ maxWidth: "fit-content" }}
              >
                <Nav.Item>
                  <Nav.Link className="custom-tab secondary" eventKey="friends">
                    Friend List
                  </Nav.Link>
                </Nav.Item>
              </Col>
            </Row>
          </Col>
        </Nav>
      </Tab.Container>
    </>
  );
}

//

export default Friends;