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
  const [chats, setChats] = useState([])
  const [error, setError] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const[activeKey, setActiveKey] = useState('')
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
        setChats([...Object.values(response.data)[0]])
        setFriends(
          [...Object.values(response.data)[0]].filter((x) => x.is_private)
        )
        setGroups(
          [...Object.values(response.data)[0]].filter((x) => !x.is_private)
        )
        console.log(response.data.returnArray[0])
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

  const list = friends.map((friend) => (
    <Row key={friend._id} className="m-0">
      <Button
        className=" secondary clear-button m-0"
        to={'/user/' + friend.friend_user_name}
        onContextMenu={(e) => {
          e.preventDefault()
          setShowPopup(!showPopup)
          setShowChat(false)
        }}
        onClick={(e) => {
          e.preventDefault()
          setShowChat(!showChat)
          setShowPopup(false)
          // TODO: fix this to not dissapear every single time, only when same button is pressed
          setActiveKey(friend._id)
          navigate(`/chats/${friend.friend_user_name}`)
        }}
      >
        {friend.friend_user_name}
      </Button>
    </Row>
  ))

  const groupList = groups.map((friend) => (
    <Row key={friend._id} className="m-0">
      <Button
        className=" secondary clear-button m-0"
        to={'/user/' + friend.name}
        onContextMenu={(e) => {
          e.preventDefault()
          setShowPopup(!showPopup)
          setShowChat(false)
        }}
        onClick={(e) => {
          e.preventDefault()
          setActiveKey(friend._id)
          setShowChat(!showChat)
          setShowPopup(false)
        }}
      >
        {friend.name}
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
            {list}
          </Row>
          <div className="border"></div>
          <Row className="m-0 pt-2">
            <h5>Groups</h5>
            <div className="border"></div>
            {groupList}
          </Row>
        </Col>
        <Col className="m-0 p-0">
          {showPopup ? <FriendPopupActions /> : null}
          {showChat ? <ChatWindow roomId ={activeKey}/> : null}
        </Col>
      </Row>
    </>
  )
}

//

export default Friends
