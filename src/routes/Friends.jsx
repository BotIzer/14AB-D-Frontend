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
        setFriends(
          [...Object.values(response.data)[0]].filter((x) => x.is_private)
        )
        setGroups(
          [...Object.values(response.data)[0]].filter((x) => !x.is_private)
        )
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
        onClick={async (e) => {
          e.preventDefault()
          // TODO: fix this to not dissapear every single time, only when same button is pressed
         const chatData = await axios.get(
            `/chat/${friend._id}/comments`,
            {
              headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              withCredentials: true,
            }
          )
          setComments(chatData.data.comments)
          setShowChat(!showChat)
          setShowPopup(false)
          // navigate(`/chats/${friend.friend_user_name}`)
        }}
      >
        {friend.friend_user_name}
      </Button>
    </Row>
  ))

  const groupList = groups.map((group) => (
    <Row key={group._id} className="m-0">
      <Button
        className=" secondary clear-button m-0"
        to={'/user/' + group.name}
        onContextMenu={(e) => {
          e.preventDefault()
          setShowPopup(!showPopup)
          setShowChat(false)
        }}
        onClick={async (e) => {
          e.preventDefault()
          const chatData = await axios.get(
            `/chat/${group.name}/comments`,
            {
              headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              withCredentials: true,
            }
          )
          setShowChat(!showChat)
          setShowPopup(false)
          navigate(`/chats/${group.name}`)
        }}
      >
        {group.name}
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
          {showChat ? <ChatWindow chatData={comments}/> : null}
        </Col>
      </Row>
    </>
  )
}

//

export default Friends
