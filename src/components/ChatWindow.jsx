import { useEffect, useState } from 'react'
import MessageList from './chat-components/MessageList'
import { Form, FormGroup, Button } from 'react-bootstrap'
import axios from '../api/axios'
import { useLocation, useParams } from 'react-router-dom'
function ChatWindow(currentChatData) {
  const location = useLocation()
  const friend = useParams(location.pathname.split('/')[1]).friendName
  const [messages, setMessages] = useState([])
  useEffect(()=>{
    if (currentChatData.chatData.length > 0) {
      setMessages(currentChatData.chatData)
    }
    console.log(currentChatData);
  },[currentChatData]);
  // useEffect(() => {
  //   setMessages(currentChatData)
  // }, [currentChatData]);
  const SendMsg = async () => {
    console.log(messages)
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
  }


  return (
    <div className="p-2 h-100 border overflow-auto">
      <MessageList messages={messages}></MessageList>
      <FormGroup controlId="sendMsg">
        <div className="row m-0">
          <Form.Control
            placeholder="Send message"
            className="w-75"
            autoFocus
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
