import { useEffect, useState } from 'react';
import MessageList from './chat-components/MessageList';
import { Form, FormGroup, Button, Container, DropdownButton, Dropdown } from 'react-bootstrap';
import axios from '../api/axios';
import { useLocation, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import FriendMenu from './FriendMenu';
import Navbar from 'react-bootstrap/Navbar';
import Ably from 'ably';

function ChatWindow(currentChatData) {
  const location = useLocation()
  const friend = useParams(location.pathname.split('/')[1]).user
  const [messages, setMessages] = useState([])
  const [showFriends, setShowFriends] = useState(false)
  const [currentChat,setCurrentChat] = useState(null)
  const [friends, setFriends] = useState([])
  const [showError, setShowError] =  useState(false)
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
      setFriends(response.data.returnFriends)
    }
    GetFriends()
    setCurrentChat(currentChatData.selectedChat)
    if(process.env.NODE_ENV === "development"){
      const socket = io('http://localhost:3000', {
      withCredentials: true
    });
    socket.on("message", (data) => {
      setMessages(prevMessages => [...prevMessages, data]) 
    });
    console.log("It is in development mode")
        return () => {
      socket.off("message");
      socket.disconnect();
    };
    }
    else{
      const ably = new Ably.Realtime({key: import.meta.env.VITE_APP_ABLY_KEY})
      const channel = ably.channels.get("commentChanges");
    channel.subscribe("commentChanges", (message) => {
      setMessages(prevMessages => [...prevMessages, message.data])
    });
    console.log("It is in production mode");
    return () =>{
      channel.unsubscribe();
    };
    }
  }, []);
  const SendMsg = async () => {
    event.preventDefault();
    const message = document.getElementById('sendMsg').value
    try {
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
              usernames: [friend]
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
    } catch (error) {
      if (error.response.status === 404) {
      }
      setShowError(true)
    }
    
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
  const CloseChat = () => {
    currentChatData.close()
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
      <Navbar className="justify-content-start pt-0" sticky="top" style={{zIndex: '1000'}}>
       
        <DropdownButton title={<img style={{width: '32px', height: '32px'}} src='/src/assets/icons/add_user_64.png' className='filter-gold'></img>} className="dropdown-button  m-0">
        <div className='overflow-auto' style={{maxHeight: "200px"}}>{friendList}</div>
        </DropdownButton>
        <Button className="close-button ms-auto" onClick={() => CloseChat()} >
          <img className="hover-filter-red" src="/src/assets/icons/close.png" alt="" />
        </Button>
        {/* TODO: BOTI MAKE IT CENTERED AND LOOK COOLIO */}
        {showError ? <p autoFocus>ERROR: </p> : null}
      </Navbar>
      <MessageList messages={messages}></MessageList>
      {showFriends ? <FriendMenu chat={currentChatData.selectedChat}></FriendMenu> : null}
      <Navbar sticky="bottom" style={{backgroundColor: '#343a40', zIndex: '1000'}}>
      <Container fluid className='justify-content-center w-100 p-0'>
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
