
import Navigation from '../components/Navigation'
import FriendPopupActions from '../components/FriendPopupActions'
import CreateChatPopup from '../components/CreateChatPopup'
import { useEffect, useState } from 'react'
import ChatWindow from '../components/ChatWindow'
import axios from '../api/axios'
import ErrorPage from '../error-page'
import { useLocation, useNavigate } from 'react-router-dom'
import { DropdownButton, Dropdown, Form, Button, Row, Col, Image } from 'react-bootstrap'

function Friends() {
  const [friends, setFriends] = useState([])
  const [groups, setGroups] = useState([])
  const [comments, setComments] = useState([])
  const [error, setError] = useState('')
  // TODO: Group these too, if possible
  const [selectedChat, setSelectedChat] = useState(null)
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [selectedChatType, setSelectedChatType] = useState('')
  const [displayName, setDisplayName] = useState('')
  // TODO: Group these together during refector to decrease rerender amounts
  const [showPopup, setShowPopup] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showCreateChat, setShowCreateChat] = useState(false)
  const location = useLocation()
  const [currentPage,setCurrentPage] = useState(parseInt(location.search.split('page=')[1]) || 0);
  const [limit, setLimit] = useState(parseInt(location.search.split('limit=')[1]) || 10);
  const navigate = useNavigate()

  addEventListener('removeFriend', () => {
    const removeIdx = friends.findIndex((element) => element == selectedFriend)
    friends.splice(removeIdx, 1)
  })

  useEffect(() => {
    const GetFriends = async () => {
      if (!localStorage.getItem('token')) {
        setError({ response: { data: { message: 'You need to login to access this page!' } } })
        return
      }
      try {
        const response = await axios.get('/chats', {
          params: {
            page: currentPage,
            limit: limit
          },
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        })
        if (response.data.returnArray) {
          console.log(response.data)
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
  const SetShowLogic = () =>{
    setShowCreateChat(true)
    setShowPopup(false)
    setShowChat(false)
  }
  const CreateGroupChat = async () => {
    axios.post(
      '/chat',
      {
        name: 'Test Chat',
        is_ttl: true,
        days_to_die: 3,
        is_private: false,
        usernames: ['random', 'sorry', 'sajtostaller']
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
  addEventListener('clicked', () => {
    setShowChat(false)
    setSelectedFriend(null)
    setSelectedChat(null)
    setSelectedChatType('')
  })
  const friendList = friends.map((chat) => (
    <Row key={chat._id} className="m-0">
      <Button
        className=" secondary clear-button m-0"
        onContextMenu={(e) => {
          e.preventDefault()
          setShowCreateChat(false)
          if (selectedChat == chat._id && selectedChatType == 'friend') {
            setShowPopup(false)
            setSelectedChat(null)
            setSelectedChatType('')
            setDisplayName('')
          }
          else {
            setShowPopup(true)
            setSelectedChat(chat._id)
            setSelectedChatType('friend')
            setDisplayName(chat.friend_user_name)
          }
          setShowChat(false)
          setSelectedFriend(chat.friend_user_name)
        }}
        onClick={async (e) => {
          e.preventDefault()
          setShowCreateChat(false)
          setSelectedChat(chat._id)
          if (selectedChat == chat._id) {
            setShowChat(false)
            setSelectedChat(null)
            setSelectedChatType('')
            return
          }
          const chatData = await axios.get(`/chat/${chat._id}/comments`, {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
          })
          setSelectedChatType('friend')
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
        className="secondary clear-button m-0 px-0"
        onContextMenu={(e) => {
          e.preventDefault()
          setShowCreateChat(false)
          if (selectedChat == chat._id && selectedChatType == 'group') {
            setShowPopup(false)
            setSelectedChat(null)
            setSelectedChatType('')
            setDisplayName('')
          }
          else {
            setShowPopup(true)
            setSelectedChat(chat._id)
            setSelectedChatType('group')
            setDisplayName(chat.name)
          }
          setShowChat(false)
          setSelectedFriend(null)
        }}
        onClick={async (e) => {
          e.preventDefault()
          setShowCreateChat(false)
          setSelectedChat(chat._id)
          if (selectedChat == chat._id) {
            setShowChat(false)
            setSelectedChat(null)
            setSelectedChatType('')
            return
          }
          const chatData = await axios.get(`/chat/${chat._id}/comments`, {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
          })
          setSelectedChatType('group')
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
          className="m-0 p-0  text-center custom-border"
          style={{ maxHeight: '60vh' }}
        >
          <Row className="m-0 pt-2">
            <h5>Friends</h5>
            <div className="border"></div>
            {friends.length == 0 ? <i>No friends?</i> : null}
            <Col>{friendList}</Col>
          </Row>
          <div className="border"></div>
          <Row className="m-0 p-0 pt-2">
            <h5>Groups</h5>
            <div className="border"></div>
            {friends.length == 0 ? <i>No groups?</i> : null}
            <Col style={{ maxHeight: '30vh' }} className='overflow-auto'>{groupList}
              </Col>
              {/*TODO create popup for the right column for creating group*/}
              <Button
                variant='outline-warning'
                onMouseEnter={() =>
                (document.getElementById("addGroup").className =
                  "filter-black")
                }
                onMouseLeave={() =>
                (document.getElementById("addGroup").className =
                  "filter-gold")
                }
              >
                <div onClick={()=>SetShowLogic()}><b>+</b> <Image id='addGroup' className='filter-gold' src="/src/assets/icons/group.png" /></div>
              </Button>
          </Row>
        </Col>
        <Col className="m-0 p-0" style={{ height: "50vh", width: "50vw" }}>
          {/* TODO: change this */}
          {showPopup ? <FriendPopupActions selectedChat={selectedChat} name={displayName} type={selectedChatType} friend={selectedFriend} /> : null}
          {showChat ? <ChatWindow type={selectedChatType} chatData={comments} selectedChat={selectedChat} /> : null}
          {/*TODO change show variables to bootstrap offcanvas <CreateChatPopup></CreateChatPopup> */ }
          {showCreateChat ? <CreateChatPopup friends={friends}/> : null}
        </Col>
      </Row>
    </>
  )
}

//

export default Friends
