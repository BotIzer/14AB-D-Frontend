import { useEffect, useState } from 'react';
import MessageList from './chat-components/MessageList';
import { Form, FormGroup, Button, Container, DropdownButton, Dropdown } from 'react-bootstrap';
import axios from '../api/axios';
import { useLocation, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import FriendMenu from './FriendMenu';
import Navbar from 'react-bootstrap/Navbar';

function ChatWindow(currentChatData) {
  const location = useLocation()
  const friend = useParams(location.pathname.split('/')[1]).user
  const [messages, setMessages] = useState([])
  const [showFriends, setShowFriends] = useState(false)
  const [currentChat,setCurrentChat] = useState(null)
  useEffect(()=>{
    setMessages(currentChatData.chatData)
  },[currentChatData]);
  useEffect(() => {
    const socket = io('http://localhost:3000', {
      withCredentials: true
    });

    socket.on("message", (data) => {
      console.log(data);
      setMessages(prevMessages => [...prevMessages, data]) 
    });
    setCurrentChat(currentChatData.selectedChat)
    return () => {
      socket.off("message");
      socket.disconnect();
    };
    //TODO FIX THIS ESLINT ERROR
  }, []);
  const SendMsg = async () => {
    const message = document.getElementById('sendMsg').value

    const response = await axios.post(
      '/createOrRetrieveChat',
      {
        friend: friend,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      }
    )
    if (response.data.length === 0) {
      await axios.post(
        '/chat',
        {
          name: friend,
          is_ttl: false,
          is_private: true,
          other_user_name: friend,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      )
    }
    await axios.post(
      '/comment',
      {
        room_id: response.data._id,
        text: message,
        is_reply: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      }
    )
    document.getElementById('sendMsg').value = "";
  }
  const HandleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      SendMsg()
    }
  };
  const AddToChat = async () =>{
    setShowFriends(true);
    // await axios.post(
    //   '/chat/addFriend',
    //   {
    //     friendName: ,
    //     chat_id: 
    //   },
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       authorization: `Bearer ${localStorage.getItem('token')}`,
    //     },
    //     withCredentials: true,
    //   })
    // onClick={()=>AddToChat()}

  }
  const dummyFriends = [
    "Markneu22",
    "Lajtaib",
    "BotIzer",
    "Floch <3",
    "Floch <3",
    "Floch <3",
    "Floch <3",
    "Floch <3",
    "Floch <3","Floch <3",
    "Floch <3","Floch <3","Floch <3","Floch <3","Floch <3","Floch <3","Floch <3","Floch <3","Floch <3","Floch <3","Floch <3","Floch <3","Floch <3","Floch <3","Floch <3","Floch <3","Floch <3","Floch <3","Floch <3","Floch <3","Floch <3","Floch <3","Floch <3","Floch <3",
  ]
  const friendList = dummyFriends.map((friend) => (
    <Dropdown.Item
        className="list-group-item secondary text-center"
        key={friend}
        onClick={() => AddToChat(friend)}>
        {friend}
    </Dropdown.Item>
));
  return (
    <div data-bs-theme="dark" className="p-0 h-100 w-100 border overflow-auto">
      <Navbar className="justify-content-end" sticky="top">
        <DropdownButton title="Add friend" className="dropdown-button dropdown-button-size my-2 mx-2">
        <div className='overflow-auto' style={{maxHeight: "200px"}}>{friendList}</div>
        </DropdownButton>
      </Navbar>
      <MessageList messages={messages}></MessageList>
      {/* TODO make this look normal*/}
      {showFriends ? <FriendMenu chat={currentChatData.selectedChat}></FriendMenu> : null}
      <Navbar sticky="bottom" style={{backgroundColor: '#343a40'}}>
      <Container fluid className='justify-content-center w-100'>
        <Navbar.Toggle aria-controls="navbarScroll" />
          <Form className='w-100'>
          <FormGroup controlId="sendMsg">
        <div className="row m-0">
          <Form.Control
            placeholder="Send message"
            className="w-75"
            autoFocus
            onKeyDown={HandleKeyDown}
          ></Form.Control>
          <Button
            variant="outline-warning"
            className="custom-button w-25 p-0 overflow-hidden"
            type="submit"
            onClick={() => SendMsg()}
          >
            Send
          </Button>
        </div>
      </FormGroup>
          </Form>
      </Container>
    </Navbar>
      {/*  */}
    </div>
  )
}

export default ChatWindow
