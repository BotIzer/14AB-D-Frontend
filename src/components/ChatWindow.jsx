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
  const [friends, setFriends] = useState([])
  useEffect(()=>{
    setMessages(currentChatData.chatData)
  },[currentChatData]);
  useEffect(() => {
    const GetFriends = async () => {
      const response = await axios.get('/friends', {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      })
      console.log(response.data);
      setFriends(response.data)
    }
    GetFriends()
    const socket = io('http://localhost:3000', {
      withCredentials: true
    });
    socket.on("message", (data) => {
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
    event.preventDefault();
    const message = document.getElementById('sendMsg').value
    if (currentChatData.type === 'friend') {
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
    }
    else{
      console.log("Id found");
      console.log(currentChatData);
      console.log("Id closed")
      await axios.post(
        '/comment',
        {
          room_id: currentChatData.selectedChat,
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
    }
    document.getElementById('sendMsg').value = "";
  }
  const HandleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      SendMsg()
    }
  };
  const AddToChat = async (friendname) =>{
    await axios.post(
      '/chat/addFriend',
      {
        friend_name: friendname,
        chat_id: currentChatData.selectedChat
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      })
  }
  const CloseChatWindow = () => {
    dispatchEvent(new Event('clicked'))
  }
  const friendList = friends.map((friend) => (
    <Dropdown.Item
        className="list-group-item secondary text-center"
        key={friend}
        onClick={() => AddToChat(friend.username)}>
        {friend.username}
    </Dropdown.Item>
));
  return (
    <div data-bs-theme="dark" className="p-0 h-100 w-100 border overflow-auto">
      <Navbar className="justify-content-start pt-0" sticky="top">
        <Button className="close-button me-auto" onClick={()=>CloseChatWindow()} >
          <img className="hover-filter-red" src="/src/assets/icons/close.png" alt="" />
        </Button>
        <DropdownButton title="Add friend" className="dropdown-button my-2 mx-2">
        <div className='overflow-auto' style={{maxHeight: "200px"}}>{friendList}</div>
        </DropdownButton>
      </Navbar>
      <MessageList messages={messages}></MessageList>
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
