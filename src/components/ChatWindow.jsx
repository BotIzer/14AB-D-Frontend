import { useEffect, useState } from 'react'
import MessageList from './chat-components/MessageList'
import { Form, FormGroup, Button } from 'react-bootstrap'
import axios from '../api/axios'
import { useLocation, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'

function ChatWindow(currentChatData) {
  const location = useLocation()
  const friend = useParams(location.pathname.split('/')[1]).user
  const [messages, setMessages] = useState([])
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
    return () => {
      socket.off("message");
      socket.disconnect();
    };
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
  return (
    // TODO: make scrollable look good
    <div className="p-2 h-100 border overflow-auto">
      <MessageList messages={messages}></MessageList>
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
    </div>
  )
}

export default ChatWindow
