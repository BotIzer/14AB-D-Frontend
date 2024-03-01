import Button from 'react-bootstrap/Button'
import Navigation from '../components/Navigation'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FriendPopupActions from '../components/FriendPopupActions'
import { useEffect, useState } from 'react'
import ChatWindow from '../components/ChatWindow'
import axios from '../api/axios'
import ErrorPage from '../error-page'
import { useNavigate } from 'react-router-dom'

function Friends() {
  const [friends, setFriends] = useState([])
  const [groups, setGroups] = useState([])
  const [comments, setComments] = useState([])
  const [error, setError] = useState('')
  const [selectedChat, setSelectedChat] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [showChat, setShowChat] = useState(false)
  
  const navigate = useNavigate()
  useEffect(() => {
    const GetFriends = async () => {
      try {
        const response = await axios.get('/chats', {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        })
        if (response.data.returnArray) {
          if (response.data.returnArray[0]) {
            setFriends(
              [...Object.values(response.data)[0]].filter((x) => x.is_private)
            )
          }
          if (response.data.returnArray[1]) {
            setGroups(
              [...Object.values(response.data)[0]].filter((x) => !x.is_private)
            )
          }
        }
      } catch (err) {
        setError(err)
      }
    }
    GetFriends()
  }, [])
  if (error != '') {
    // TODO fix this, to not even show the first return.
    return <ErrorPage errorStatus={error} />
  }

  const list = friends.map((chat) => (
    <Row key={chat._id} className="m-0">
      <Button
        className=" secondary clear-button m-0"
        onContextMenu={(e) => {
          e.preventDefault()
          setShowPopup(!showPopup)
          setShowChat(false)
        }}
        onClick={async (e) => {
          e.preventDefault()
          setSelectedChat(chat._id)
          if (selectedChat == chat._id) {
            setShowChat(false)
            setSelectedChat(null)
            return
          }
          const chatData = await axios.get(`/chat/${chat._id}/comments`, {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
          })
          setComments(chatData.data.comments)
          setShowChat(true)
          setShowPopup(false)
          navigate(`/chats/${chat.friend_user_name}`)
        }}
      >
        {chat.friend_user_name}
      </Button>
    </Row>
  ))

  const groupList = groups.map((chat) => (
    <Row key={chat._id} className="m-0">
      <Button
        className=" secondary clear-button m-0"
        onContextMenu={(e) => {
          e.preventDefault()
          setShowPopup(!showPopup)
          setShowChat(false)
        }}
        onClick={async (e) => {
          e.preventDefault()
          setSelectedChat(chat._id)
          if (selectedChat == chat._id) {
            setShowChat(false)
            setSelectedChat(null)
            return
          }
          const chatData = await axios.get(`/chat/${chat._id}/comments`, {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
          })
          setComments(chatData.data.comments)
          setShowChat(true)
          setShowPopup(false)
          navigate(`/chats/${chat.name}`)
        }}
      >
        {chat.name}
      </Button>
    </Row>
  ))
  return (
    <>
      <Navigation></Navigation>
      <Row className="w-100 h-50 m-0">
        <Col 
          data-bs-theme="dark"
          className="m-0 p-0 list-group list-group-flush overflow-auto text-center custom-border"
        >
          <Row className="m-0 pt-2">
            <h5>Friends</h5>
            <div className="border"></div>
            {friends.length == 0 ? <i>No friends?</i> : null}
            {list}
          </Row>
          <div className="border"></div>
          <Row className="m-0 pt-2">
            <h5>Groups</h5>
            <div className="border"></div>
            {friends.length == 0 ? <i>No groups?</i> : null}
            {groupList}
          </Row>
        </Col>
        <Col className="m-0 p-0" style={{height: "50vh"}}>
          {showPopup ? <FriendPopupActions /> : null}
          {showChat ? <ChatWindow chatData={comments} /> : null}
        </Col>
      </Row>
    </>
  )
}

//

export default Friends
