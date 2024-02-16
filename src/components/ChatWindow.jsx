import { useState } from 'react'
import MessageList from './chat-components/MessageList'
import { Form, FormGroup, Button } from 'react-bootstrap'
import axios from '../api/axios'
import { useLocation, useParams } from 'react-router-dom'
function ChatWindow() {
  const location = useLocation()
  const friend = useParams(location.pathname.split('/')[2]).friendName
  const SendMsg = async () => {
    const message = document.getElementById('sendMsg').value
    const response = await axios.post(
      '/chat/private',
      {
        friend: friend,
        chat_id: '', //TODO: here we need the chat id if exists!!
      },
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      }
    )
    console.log('=======' + response.data.roomId)
    // await axios.post(
    //   '/comment/createComment',
    //   {
    //     room_id: response.data.roomId,
    //     text: message,
    //     is_reply: false,
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //     withCredentials: true,
    //   }
    // )
  }

  const [messages, setMessages] = useState([])

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
