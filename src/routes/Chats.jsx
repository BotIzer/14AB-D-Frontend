import Navigation from '../components/Navigation'
import FriendPopupActions from '../components/FriendPopupActions'
import CreateChatPopup from '../components/CreateChatPopup'
import { useEffect, useState } from 'react'
import ChatWindow from '../components/ChatWindow'
import axios from '../api/axios'
import ErrorPage from '../error-page'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Row, Col, Image, Pagination, Nav, Tab, Tooltip, OverlayTrigger } from 'react-bootstrap'

function Chats() {
  const location = useLocation()
  const navigate = useNavigate()

  const [directMessages, setDirectMessages] = useState([])
  const [groups, setGroups] = useState([])
  const [friends, setFriends] = useState([])
  const [comments, setComments] = useState([])
  const [error, setError] = useState('')
  const [props, setProps] = useState({
    selectedChat: null,
    selectedFriend: null,
    selectedChatType: null,
    displayName: '',
  })
  const [showData, setShowData] = useState({
    showChat: false,
    showPopup: false,
    showCreateChat: false,
    lastAction: null,
  })
  const [owners, setOwners] = useState({})
  const [users, setUsers] = useState()
  const [paginationPageData, setPaginationPageData] = useState({
    dmCurrentPage: parseInt(new URLSearchParams(location.search).get('dmpage')) || 1, 
    dmPageCount: parseInt(new URLSearchParams(location.search).get('dmpage')) || 1,
    groupCurrentPage: parseInt(new URLSearchParams(location.search).get('grouppage')) || 1, 
    groupPageCount: parseInt(new URLSearchParams(location.search).get('grouppage')) || 1,
    friendsCurrentPage: parseInt(new URLSearchParams(location.search).get('friendspage')) || 1, 
    friendsPageCount: parseInt(new URLSearchParams(location.search).get('friendspage')) || 1,
    })
  const [activeKey, setActiveKey] = useState('chats')
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handlePaginationClick = (pageNumber, pageType) =>{
    
    setPaginationPageData({
      dmCurrentPage: (pageType == 'dm'? pageNumber : paginationPageData.dmCurrentPage),
      groupCurrentPage: (pageType == 'group'? pageNumber : paginationPageData.groupCurrentPage),
      friendsCurrentPage: (pageType == 'friends'? pageNumber : paginationPageData.friendsCurrentPage),
      dmPageCount: paginationPageData.dmPageCount,
      groupPageCount: paginationPageData.groupPageCount,
      friendsPageCount: paginationPageData.friendsPageCount
      })
      
    navigate(`/chats?${pageType}page=${pageNumber}`)
  } 



  const ShowChat = (action) => {
    setShowData({
      showChat: true,
      showPopup: false,
      showCreateChat: false,
      lastAction: action,
    })
  }
  const ShowPopup = (action) => {
    setShowData({
      showChat: false,
      showPopup: true,
      showCreateChat: false,
      lastAction: action,
    })
  }
  const ShowCreate = () => {
    setShowData({ showChat: false, showPopup: false, showCreateChat: true })
  }
  const DoNotShow = () => {
    setShowData({ showChat: false, showPopup: false, showCreateChat: false })
  }
  const ClearProps = () => {
    setProps({
      selectedChat: null,
      selectedFriend: null,
      selectedChatType: null,
      displayName: '',
      owner: '',
    })
  }
  const directMessageList = directMessages.map((chat) => (
  <Row key={chat._id} className='m-0'>
    <Button
      className={`secondary clear-button m-0`}
      onContextMenu={(e) => {
        e.preventDefault()
        if (
          props.selectedChat === chat._id &&
          showData.lastAction === 'context'
        ) {
          DoNotShow()
          ClearProps()
        } else {
          ShowPopup('context')
          setProps({
            selectedChat: chat._id,
            selectedChatType: 'friend',
            displayName: chat.friend_user_name,
          })
        }
        setProps((prevProps) => ({
          ...prevProps,
          selectedFriend: chat.friend_user_name,
        }))
      }}
      onClick={async (e) => {
        try {
          e.preventDefault()
        if (
          props.selectedChat === chat._id &&
          showData.lastAction === 'click'
        ) {
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
        setProps((prevProps) => ({
          ...prevProps,
          selectedChat: chat._id,
          selectedChatType: 'friend',
        }))
        setComments(chatData.data.comments)
        ShowChat('click')
        navigate(`/chats/${chat.friend_user_name}`)
        } catch (error) {
          setErrorMessage('Could not load chat')
          setShowError(true)
        }
      }}
    >
      {chat.friend_user_name}
    </Button>
  </Row>
))
  const friendList = friends.map((friend)=>{
    return (
      <Row key={friend.username} className='m-0'>
      <OverlayTrigger overlay={<Tooltip>Message</Tooltip>}>
      <Button
      className={`secondary clear-button m-0`}
      onContextMenu={(e) => {
        e.preventDefault()
        if (
          showData.lastAction === 'context'
        ) {
          DoNotShow()
          ClearProps()
        } else {
          ShowPopup('context')
        }
        setProps({
          selectedChat: null,
          selectedFriend: friend.username,
          selectedChatType: 'friend',
          displayName: friend.username,
        })
      }}
      onClick={async (e) => {
        e.preventDefault()
        try {
          const response = await axios.post(
            '/createOrRetrieveChat',
            {
              friend: friend.username,
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
                name: friend.username,
                is_ttl: false,
                is_private: true,
                other_user_name: friend.username,
                usernames: [friend.username]
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
          else{
            setActiveKey('chats')
          }
          if (
            showData.lastAction === 'click'
          ) {
            DoNotShow()
            ClearProps()
            return
          }
          setProps({
            selectedChat: null,
            selectedFriend: friend.username,
            selectedChatType: 'friend',
            displayName: friend.username,
          })
        } catch (error) {
          setErrorMessage('Could not load friend list')
          setShowError(true)
        }
      }}
    >
      {friend.username}
    </Button>
    </OverlayTrigger>

  </Row>
    )
  })
  const groupList = groups.map((chat) => (
    <Row key={chat._id} className='m-0'>
      <Button
        className='secondary clear-button m-0 px-0'
        onContextMenu={(e) => {
          e.preventDefault()
          if (
            props.selectedChat == chat._id &&
            showData.lastAction === 'context'
          ) {
            DoNotShow()
            ClearProps()
          } else {
            ShowPopup('context')
            setProps({
              selectedFriend: null,
              selectedChat: chat._id,
              selectedChatType: 'group',
              displayName: chat.name,
            })
          }
        }}
        onClick={async (e) => {
          try {
            e.preventDefault()
            if (
              props.selectedChat == chat._id &&
              showData.lastAction === 'click'
            ) {
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
            setProps({
              selectedFriend: null,
              selectedChat: chat._id,
              selectedChatType: 'group',
              displayName: chat.name,
            })
            setComments(chatData.data.comments)
            ShowChat('click')
            navigate(`/chats/${chat.name}`)
          } catch (error) {
            setErrorMessage('Could not load group')
            setShowError(true)
          }
        }}
      >
        {chat.name}
      </Button>
    </Row>
  ))

  let dmPages = []
  for (let i = 1; i <= paginationPageData.dmPageCount; i++) {
    dmPages.push(
      <Pagination.Item key={i} active={i === paginationPageData.dmCurrentPage} onPointerDown={()=>handlePaginationClick(i, 'dm')}>
        {i}
      </Pagination.Item>
    )
  }
  let groupPages = []
  for (let i = 1; i <= paginationPageData.groupPageCount; i++) {
    groupPages.push(
      <Pagination.Item key={i} active={i === paginationPageData.groupCurrentPage} onPointerDown={()=>handlePaginationClick(i, 'group')}>
        {i}
      </Pagination.Item>
    )
  }
  let friendsPages = []
  for (let i = 1; i <= paginationPageData.friendsPageCount; i++) {
    friendsPages.push(
      <Pagination.Item key={i} active={i === paginationPageData.friendsCurrentPage} onPointerDown={()=>handlePaginationClick(i, 'friends')}>
        {i}
      </Pagination.Item>
    )
  }

  useEffect(() => {
    const GetDirectMessages = async () => {
      if (!localStorage.getItem('token')) {
        setError({
          response: {
            data: { message: 'You need to login to access this page!' },
          },
        })
        return
      }
      try {
        const response = await axios.get('/chats', {
          params: {
            page: paginationPageData.dmCurrentPage
          },
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        })
        if (response.data.returnArray) {
          if (response.data.returnArray) {
            setDirectMessages(
              [...Object.values(response.data.returnArray)].filter(
                (x) => x.is_private
              )
            )
            setGroups(
              [...Object.values(response.data.returnArray)].filter(
                (x) => !x.is_private
              )
            )
          }
        }
      } catch (err) {
        setError(err)
      }
    }
    const GetFriends = async () =>{
      try {
        const response = await axios.get('friends',{
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        })
        setFriends(response.data.returnFriends)
      } catch (err) {
        setError(err)
      }
    }
    GetFriends()
    GetDirectMessages()
  }, [])
  useEffect(() => {
    const SetOwner = async () => {
      let chatOwner = {}
      let chatUsers = {}
      for (let index = 0; index < groups.length; index++) {
        try {
          const response = await axios.get(`/chat/${groups[index]._id}`, {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
          })
        } catch (error) {
          setErrorMessage(error)
          setShowError(true)
        }
        chatUsers = { ...users, [groups[index]._id]: response.data.chat.users }
        chatOwner = {
          ...chatOwner,
          [groups[index]._id]: response.data.chat.owner,
        }
      }
      setOwners(chatOwner)
      setUsers(chatUsers)
    }
    SetOwner()
  }, [groups])
  if (error != '') {
    return <ErrorPage errorStatus={error} />
  }

  return (
    <>
      <Navigation></Navigation>
      <Tab.Container defaultActiveKey='chats' activeKey={activeKey}>
        <Tab.Content>
          <Tab.Pane eventKey='chats'>
            <Row className='w-100 h-50 m-0'>
              <Col
                data-bs-theme='dark'
                className='m-0 p-0  text-center custom-border'
                style={{ maxHeight: '80vh', maxWidth: '50vw' }}
              >
                <Row className='m-0 pt-2'>
                  <h5>Direct messages</h5>
                  <div className='border'></div>
                  {friends.length == 0 ? <i>No friends?</i> : null}
                  <Col className='overflow-auto'>
                    {directMessageList}
                    <Pagination className='justify-content-center p-0 m-0 custom-pagination'>
                      <Pagination.Prev onPointerDown={()=>handlePaginationClick(paginationPageData.dmCurrentPage -1 <= 0 ? paginationPageData.dmPageCount : paginationPageData.dmCurrentPage - 1, 'dm')}/>
                      {dmPages}
                      <Pagination.Next onPointerDown={()=>handlePaginationClick(paginationPageData.dmCurrentPage +1 > paginationPageData.dmPageCount ? 1 : paginationPageData.dmCurrentPage + 1, 'dm')}/>
                    </Pagination>{' '}
                  </Col>
                </Row>
                <div className='border'></div>
                <Row className='m-0 p-0 pt-2'>
                  <h5>Groups</h5>
                  <div className='border'></div>
                  {groups.length == 0 ? <i>No groups?</i> : null}
                  <Col style={{ maxHeight: '30vh' }} className='overflow-auto'>
                    {groupList}
                    <Row>
                      <Pagination className='justify-content-center p-0 m-0 custom-pagination'>
                        <Pagination.Prev onPointerDown={()=>handlePaginationClick(paginationPageData.groupCurrentPage -1 <= 0 ? paginationPageData.groupPageCount : paginationPageData.groupCurrentPage - 1, 'group')}/>
                        {groupPages}
                        <Pagination.Next onPointerDown={()=>handlePaginationClick(paginationPageData.groupCurrentPage +1 > paginationPageData.groupPageCount ? 1 : paginationPageData.groupCurrentPage + 1, 'group')}/>
                      </Pagination>{' '}
                    </Row>
                  </Col>
                  <Button
                    variant='outline-warning'
                    onMouseEnter={() =>
                      (document.getElementById('addGroup').className =
                        'filter-black')
                    }
                    onMouseLeave={() =>
                      (document.getElementById('addGroup').className =
                        'filter-gold')
                    }
                  >
                    <div onClick={() => ShowCreate()}>
                      <b>+</b>{' '}
                      <Image
                        id='addGroup'
                        className='filter-gold'
                        src={import.meta.env.VITE_CREATE_GROUP_BUTTON}
                      />
                    </div>
                  </Button>
                </Row>
              </Col>
              <Col className='m-0 p-0' style={{ maxWidth: '50vw' }}>
                {showData.showPopup ? (
                  <FriendPopupActions
                    users={users}
                    owners={owners}
                    selectedChat={props.selectedChat}
                    name={props.displayName}
                    type={props.selectedChatType}
                    friend={props.selectedFriend}
                  />
                ) : null}
                {showData.showChat ? (
                  <ChatWindow
                    close={() => DoNotShow()}
                    type={props.selectedChatType}
                    chatData={comments}
                    selectedChat={props.selectedChat}
                  />
                ) : null}
                {showData.showCreateChat ? (
                  <CreateChatPopup
                    close={() => DoNotShow()}
                    friends={friends}
                  />
                ) : null}
              </Col>
            </Row>
          </Tab.Pane>
          <Tab.Pane eventKey='friends'>
            <Row className='w-100 h-50 m-0'>
              <Col
                data-bs-theme='dark'
                className='m-0 p-0  text-center custom-border'
                style={{ maxHeight: '80vh', maxWidth: '50vw' }}
              >
                <Row className='m-0 pt-2'>
                  <h5>Friends</h5>
                  <div className='border'></div>
                  {friends.length == 0 ? <i>No friends?</i> : null}
                  <Col className='overflow-auto'>
                    {friendList}
                    <Pagination className='justify-content-center p-0 m-0 custom-pagination'>
                      <Pagination.Prev onPointerDown={()=>handlePaginationClick(paginationPageData.friendsCurrentPage -1 <= 0 ? paginationPageData.friendsPageCount : paginationPageData.friendsCurrentPage - 1, 'friends')}/>
                      {friendsPages}
                      <Pagination.Next onPointerDown={()=>handlePaginationClick(paginationPageData.friendsCurrentPage +1 > paginationPageData.friendsPageCount ? 1 : paginationPageData.friendsCurrentPage + 1, 'friends')}/>
                    </Pagination>{' '}
                  </Col>
                </Row>
                <div className='border'></div>
              </Col>
              <Col className='m-0 p-0' style={{ maxHeight: '80vh', maxWidth: '50vw'}}>
                  {showData.showPopup ? (
                    <FriendPopupActions
                      users={users}
                      owners={owners}
                      selectedChat={props.selectedChat}
                      name={props.displayName}
                      type={props.selectedChatType}
                      friend={props.selectedFriend}
                    />
                  ) : null}
                  {showData.showChat ? (
                    <ChatWindow
                      close={() => DoNotShow()}
                      type={props.selectedChatType}
                      chatData={comments}
                      selectedChat={props.selectedChat}
                    />
                  ) : null}
                </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>
        <Nav
          className='fixed-bottom justify-content-center'
          style={{ backgroundColor: '#343a40' }}
        >
          <Col>
            <Row className='justify-content-center'>
              <Col
                className='text-center p-0'
                style={{ maxWidth: 'fit-content' }}
              >
                <Nav.Item>
                  <Nav.Link className='custom-tab secondary' eventKey='chats' onPointerDown={()=>setActiveKey('chats')}>
                    Chats
                  </Nav.Link>
                </Nav.Item>
              </Col>
              <Col
                className='text-center p-0'
                style={{ maxWidth: 'fit-content' }}
              >
                <Nav.Item>
                  <Nav.Link className='custom-tab secondary' eventKey='friends' onPointerDown={()=>setActiveKey('friends')}>
                    Friend List
                  </Nav.Link>
                </Nav.Item>
              </Col>
            </Row>
          </Col>
        </Nav>
      </Tab.Container>
    </>
  )
}


export default Chats
