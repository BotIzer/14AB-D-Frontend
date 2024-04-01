
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
  const [props, setProps] = useState({selectedChat: null, selectedFriend: null, selectedChatType: null, displayName: ''})
  const [showData, setShowData] = useState({showChat: false, showPopup: false, showCreateChat: false, lastAction: null})
  const location = useLocation()
  const [pageDetails, setPageDetails] = useState({
    currentPage: parseInt(location.search.split('page=')[1]) || 0,
    limit: parseInt(location.search.split('limit=')[1]) || 10
  });
  const navigate = useNavigate()

  useEffect(() => {
    const GetFriends = async () => {
      if (!localStorage.getItem('token')) {
        setError({ response: { data: { message: 'You need to login to access this page!' } } })
        return
      }
      try {
        const response = await axios.get('/chats', {
          params: {
            page: pageDetails.currentPage,
            limit: pageDetails.limit
          },
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

  const ShowChat= (action)=>{
    setShowData({showChat: true, showPopup: false, showCreateChat: false, lastAction: action})
  }
  const ShowPopup = (action) =>{
    setShowData({showChat: false, showPopup: true, showCreateChat: false, lastAction: action})
  }
  const ShowCreate = () =>{
    setShowData({showChat: false, showPopup: false, showCreateChat: true})
  }
  const DoNotShow = () =>{
    setShowData({showChat: false, showPopup: false, showCreateChat: false})
  }
  const ClearProps = () =>{
    setProps({selectedChat: null, selectedFriend: null, selectedChatType: null, displayName: ''})
  }
  if (error != '') {
    return <ErrorPage errorStatus={error} />
  }

  const friendList = friends.map((chat) => (
    <Row key={chat._id} className="m-0">
      <Button
        className=" secondary clear-button m-0"
        onContextMenu={(e) => {
          e.preventDefault()
          if (props.selectedChat == chat._id && showData.lastAction === "context") {
            DoNotShow()
            ClearProps()
          }
          else {
            ShowPopup("context")
            setProps({selectedChat: chat._id, selectedChatType: 'friend', displayName: chat.friend_user_name})
          }
          setProps(prevProps=>({...prevProps, selectedFriend: chat.friend_user_name}))
        }}
        onClick={async (e) => {
          e.preventDefault()
          if (props.selectedChat == chat._id && showData.lastAction === "click") {
            DoNotShow()
            ClearProps()
            return
          }
          const chatData = await axios.get(`/chat/${chat._id}/comments`, {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
          })
          setProps(prevProps=>({...prevProps, selectedChat: chat._id, selectedChatType: 'friend'}))
          setComments(chatData.data.comments)
          ShowChat("click")
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
          if (props.selectedChat == chat._id && showData.lastAction === "context") {
            DoNotShow()
            ClearProps()
          }
          else {
            ShowPopup("context")
            setProps({selectedFriend: null, selectedChat: chat._id, selectedChatType: 'group', displayName: chat.name})
          }
        }}
        onClick={async (e) => {
          e.preventDefault()
          if (props.selectedChat == chat._id && showData.lastAction === "click") {
            DoNotShow()
            ClearProps()
            return
          }
          const chatData = await axios.get(`/chat/${chat._id}/comments`, {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
          })
          setProps({selectedFriend: null, selectedChat: chat._id, selectedChatType: 'group', displayName: chat.name})
          setComments(chatData.data.comments)
          ShowChat("click")
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
            {groups.length == 0 ? <i>No groups?</i> : null}
            <Col style={{ maxHeight: '30vh' }} className='overflow-auto'>{groupList}
              </Col>
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
                <div onClick={()=>ShowCreate()}><b>+</b> <Image id='addGroup' className='filter-gold' src="/src/assets/icons/group.png" /></div>
              </Button>
          </Row>
        </Col>
        <Col className="m-0 p-0" style={{ height: "50vh", width: "50vw" }}>
          {showData.showPopup ? <FriendPopupActions selectedChat={props.selectedChat} name={props.displayName} type={props.selectedChatType} friend={props.selectedFriend} /> : null}
          {showData.showChat ? <ChatWindow close={()=>DoNotShow()} type={props.selectedChatType} chatData={comments} selectedChat={props.selectedChat} /> : null}
          {showData.showCreateChat ? <CreateChatPopup close={()=>DoNotShow()} friends={friends}/> : null}
        </Col>
      </Row>
    </>
  )
}

//

export default Friends
