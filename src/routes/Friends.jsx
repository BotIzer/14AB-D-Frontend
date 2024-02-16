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
  const [chats, setChats] = useState([])
  const [error, setError] = useState('')
  const [groups, setGroups] = useState([])
  // ['Group1', 'Group2', 'Group3', 'Group4']
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
        setChats([...Object.values(response.data)[0]])
        setFriends(
          [...Object.values(response.data)[0]].filter((x) => x.is_private)
        )
        setGroups(
          [...Object.values(response.data)[0]].filter((x) => !x.is_private)
        )
      } catch (err) {
        setError(err)
      }

      // console.log([...Object.values(response.data)[0]][0])
    }
    GetFriends()
  }, [])
  if (error != '') {
    return <ErrorPage errorStatus={error} />
  }

  const list = friends.map((friend) => (
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
          setShowChat(!showChat)
          setShowPopup(false)
          navigate(`/chats/${friend.name}`)
        }}
      >
        {friend.name}
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
          {showChat ? <ChatWindow /> : null}
        </Col>
      </Row>
    </>
  )
}

//

export default Friends
