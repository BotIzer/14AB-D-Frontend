import Navigation from '../components/Navigation'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import { useEffect, useState } from 'react'
import ErrorPage from '../error-page'
import { Link } from 'react-router-dom'
import ChatWindow from '../components/ChatWindow'
import {
  Row,
  Col,
  Container,
  Image as ReactImage,
  Button,
  OverlayTrigger,
  Tooltip,
  Offcanvas,
  Table
} from 'react-bootstrap'

function UserPage() {
  const location = useLocation()
  const { user } = useParams(location.pathname.split('/')[2])
  const navigate = useNavigate()

  const [error, setError] = useState('')
  const [messages, setMessages] = useState([])
  const [showChat, setShowChat] = useState(false)
  const [chatId, setChatId] = useState(null)
  const [isFriend, setIsFriend] = useState(false)
  const [hasFriendRequest, setHasFriendRequest] = useState(false)
  const [userData, setUserData] = useState(null)
  const [isSameUser, setIsSameUser] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('userInfo') !== null)
  const [isBannerValid, setIsBannerValid] = useState(true)
  const [showError, setShowError] = useState(false)
 
  const SendFriendRequest = async () => {
    try {
      if(!isLoggedIn){
        setError('Log in to send a friend request!')
        return
      }
      await axios.post(
        `/friend/${user}`,
        {
          friendName: user,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      )
    } catch (err) {
      setShowError(true)
      setError(err)
    }
  }

  const CloseChat = () => {
    setShowChat(false)
  }
  
  let hobbyList

  if (userData !== null && userData.hobbies.length!== 0) {
     hobbyList = userData.hobbies.map((hobby,index) => (
      <th style={{ fontSize: 'small' }} key={index}>
        <i className='tertiary'>{hobby}</i>
      </th>
    ))
  }else {
    hobbyList = <th style={{ fontSize: 'small' }}>No hobbies</th>
  }

  

  useEffect(() => {
    const GetPageDetails = async () => {
      try {
        InitializeUserData()
        setIsSameUser(
          isLoggedIn && user === JSON.parse(localStorage.getItem('userInfo')).username
        )
        if (!isSameUser && isLoggedIn) {
          const response = await axios.get('/chats', {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
          })
          // if we have ANY chats, we try to find the messages for the chat with the user we're viewing
          if (
            response.data.returnArray.length != 0 &&
            response.data.returnArray[0].friend_user_name === user
          ) {
            const chatData = await axios.get(
              `/chat/${response.data.returnArray[0]._id}/comments`,
              {
                headers: {
                  'Content-Type': 'application/json',
                  authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                withCredentials: true,
              }
            )
            setMessages(chatData.data.comments)
            setChatId(response.data.returnArray[0]._id)
          }
          const friendRequests = await axios.get(
            '/user/friends/requests',
            {
              headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              withCredentials: true,
            }
          )
          const sentFriendRequests = await axios.get(
            '/user/friends/sentRequests',
            {
              headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              withCredentials: true,
            }
          )
          if (
            (friendRequests.data.requests &&
              friendRequests.data.requests.includes(user)) ||
            sentFriendRequests.data.sentRequests.includes(user)
          ) {
            setHasFriendRequest(true)
            return
          }
          const friends = await axios.get(
            '/friends',
            {
              headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              withCredentials: true,
            }
          )
          if (friends.data.returnFriends.some((friend) => friend.username === user)) {
            setIsFriend(true)
            return
          }
        }
      } catch (err) {
        setError(err)
        setShowError(true)
      }
    }
    const InitializeUserData = async () => {
      try {
        const userResponse = await axios.get(
          `/user/${user}`,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        )
        setUserData(userResponse.data.user)
      } catch (error) {
        setError(error)
        setShowError(true)
      }
    }
    GetPageDetails()
  }, [user])
  useEffect(()=>{
    if(userData !== null){
    const img = new Image()
    img.src = userData.profile_image
    img.onload = ()=>{
      setIsBannerValid(true)
    }
    img.onerror = () => {
      setIsBannerValid(false)
    }
    }
  },[userData])

  if (error !== '') {
    return <ErrorPage errorStatus={error} />
  }

  return (
    <>
      <Navigation></Navigation>
      <Container data-bs-theme='dark'>
        <Row className='m-0 border' style={{ height: '80vh' }}>
          <Offcanvas data-bs-theme='dark' show={showChat && !isSameUser}>
            <ChatWindow
              close={CloseChat}
              type='friend'
              selectedChat={chatId}
              chatData={messages}
            ></ChatWindow>
          </Offcanvas>
          <Col className='border overflow-auto h-100'>
            <Row className='justify-content-center position-relative'>
              <ReactImage
                className='profileSize img-fluid'
                src={userData !== null && isBannerValid ? userData.profile_image : import.meta.env.VITE_BFF_DEFAULT}
                roundedCircle
                style={{ float: 'center' }}
              ></ReactImage>
            </Row>
            <Row className='justify-content-center'>
              <Table responsive className='m-0'>
              <tbody>
                <tr className='text-center'>{userData !== null ? hobbyList : null}</tr>
              </tbody>
              </Table>
            </Row>
            <Row className='justify-content-center'>
              <OverlayTrigger
                placement='right'
                overlay={
                  <Tooltip>
                    {localStorage.getItem('userInfo') === null ? 'Log in to message' : (user !==
                    JSON.parse(localStorage.getItem('userInfo')).username
                      ? 'Message'
                      : 'This is you')}
                  </Tooltip>
                }
              >
                <Button
                  className='text-center clear-button fs-2 primary'
                  style={{ width: 'auto' }}
                  onClick={() => isLoggedIn && !isSameUser ? setShowChat(!showChat) : null}
                >
                  {user}
                </Button>
              </OverlayTrigger>
            </Row>
            <Row className='justify-content-center'>
              {!hasFriendRequest && !isFriend && !isSameUser && isLoggedIn ? (
                <Button
                  className='clear-button'
                  style={{ width: 'auto', height: 'auto' }}
                  onClick={() => SendFriendRequest()}
                >
                  <ReactImage
                    src={import.meta.env.VITE_ADD_FRIEND_BUTTON}
                    style={{ width: '32px', height: '32px' }}
                    className='hover-filter-gold'
                  />
                </Button>
              ) : null}
              {localStorage.getItem('userInfo') !== null && user ===
              JSON.parse(localStorage.getItem('userInfo')).username ? (
                <Button
                  className='rounded-pill custom-button'
                  style={{ width: 'auto', height: 'auto' }}
                  onClick={() => navigate(`/edituser/${user}`)}
                >
                  <ReactImage
                    src={import.meta.env.VITE_EDIT_BUTTON}
                    style={{ width: '32px', height: '32px' }}
                    className='hover-filter-gold'
                  />
                </Button>
              ) : null}
            </Row>

            <div style={{ borderTop: '3px solid #44454c' }}></div>
            <Row>
              <p className='text-justify secondary text-center'>
                {userData !== null ? userData.description : null}
              </p>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}
export default UserPage
