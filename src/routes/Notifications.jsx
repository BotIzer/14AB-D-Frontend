import Navigation from '../components/Navigation'
import { useEffect, useState } from 'react'
import axios from '../api/axios'
import {
  Button,
  Container,
  Tab,
  Row,
  Col,
  Nav,
  Pagination,
} from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function Notifications() {
  const navigate = useNavigate()
  const location = useLocation()
  const [friendRequests, setFriendRequests] = useState([])
  const [toggleTab, setToggleTab] = useState('requests')
  const [notifications,setNotifications] = useState({})
  const [pageData, setPageData] = useState({currentPage: parseInt(new URLSearchParams(location.search).get('page')) || 1, 
  pageCount: parseInt(new URLSearchParams(location.search).get('page')) || 1})
  const [removeId, setRemoveId] = useState('')
  const [seenNotifications, setSeenNotifications] = useState([])
  const [showError, setShowError] = useState(false)
  const [error, setError] = useState('')
  

  
  const AcceptFriendRequest = async (requestCreator) => {
    try {
      await axios.post(
        `/acceptFriendRequest/${requestCreator}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      )
      setFriendRequests((prevItems) =>
        prevItems.filter((friend) => friend !== requestCreator)
      )
    } catch (error) {
      setError('Could not accept friend request')
      setShowError(true)
    }
  }
  const DeclineFriendRequest = async (requestCreator) => {
    try {
      await axios.post(
        `/declineFriendRequest/${requestCreator}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      )
      setFriendRequests((prevItems) =>
        prevItems.filter((friend) => friend !== requestCreator)
      )
    } catch (error) {
      setError('Could not decline friend request')
      setShowError(true)
    }
  }
  const SendSeen = async (seenNotification) =>{
    try {
      setSeenNotifications([...seenNotifications, seenNotification])
    await axios.put(`/notification/${seenNotification}`,
  {
    seen: true
  },
  {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    withCredentials: true,
  })
    } catch (error) {
      setError('Something went wrong')
      setShowError(true)  
    }
  }
  let listItems = notifications.notifications && notifications.notifications.map((notification) => (
    <div key={notification.id}>
      <Row className='mt-2'>
        <p className={seenNotifications.includes(notification.id) ? 'text-muted' : 'secondary'} >{notification.text}</p>
      </Row>
      <Row className=' justify-content-around'>
        <Button style={{ width: '40%' }} variant='outline-warning px-0' disabled={seenNotifications.includes(notification.id)} onPointerDown={() => SendSeen(notification.id)}>Seen</Button>
        <Button style={{ width: '40%' }} variant='outline-danger px-0' onPointerDown={() => DeleteNotification(notification.id)}>Delete</Button>
      </Row>
    </div>
  ))

  
  const requestsList = friendRequests.map((friend) => (
    <div>
      <Row>
        <Link
          className='primary my-2'
          to={`/user/${friend}`}
          style={{ textDecoration: 'none', width: 'auto' }}
        >
          <b>
            <i>{friend}</i>
          </b>
        </Link>
      </Row>
      <Row className='border-bottom border-secondary'>
        <Col className='tertiary'>wants to be your friend!</Col>
        <Col>
          <Row className='px-2 justify-content-around'>
            <Button style={{ width: '40%' }} variant='outline-warning px-0' onPointerDown={()=>AcceptFriendRequest(friend)}>
              Accept
            </Button>
            <Button style={{ width: '40%' }} variant='outline-danger px-0' onPointerDown={()=>DeclineFriendRequest(friend)}>
              Decline
            </Button>
          </Row>
        </Col>
      </Row>
    </div>
  ))
  const DeleteNotification = async(deletionId) =>{
    try {
      await axios.delete(
        `/notification/${deletionId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      )
      setRemoveId(deletionId)
      setNotifications(prevNotifications => {
        return {
            ...prevNotifications,
            notifications: prevNotifications.notifications.filter(notification => notification.id !== deletionId)
        }
    })
    } catch (error) {
      setError('Could not delete notification')
      setShowError(true)
    }
  }
  const handlePaginationPointerDown = (pageNumber) =>{
    setPageData(prevState => ({
      ...prevState,
      currentPage: pageNumber
    }))
    navigate(`/notifications?page=${pageNumber}`)
  } 
  let pages = []
  if(pageData.currentPage-1 > 0){
    pages.push(
      <Pagination.Item onPointerDown={()=>handlePaginationPointerDown(pageData.currentPage-1)} key={pageData.currentPage-1} active={false}>
        {pageData.currentPage-1}
      </Pagination.Item>
      )
  }
  pages.push(
    <Pagination.Item onPointerDown={()=>handlePaginationPointerDown(pageData.currentPage)} key={pageData.currentPage} active={true}>
      {pageData.currentPage}
    </Pagination.Item>
    )
    if (pageData.currentPage+1 <= pageData.pageCount) {
      pages.push(
        <Pagination.Item onPointerDown={()=>handlePaginationPointerDown(pageData.currentPage+1)} key={pageData.currentPage+1} active={false}>
          {pageData.currentPage+1}
        </Pagination.Item>
        )
    }
  useEffect(() => {
    const GetFriendRequests = async () => {
      try {
        const response = await axios.get(`/user/friends/requests?page=${pageData.currentPage-1}`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        })
        response.data.returnRequests.length !== 0
          ? setFriendRequests(response.data.returnRequests)
          : []
      } catch (error) {
        setError('Could not get friend requests')
        setShowError(true)
      }
    }
    const GetNotifications = async() => {
      try {
        const response = await axios.get('/notification',
    {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true,
    })
    setPageData({currentPage: pageData.currentPage, pageCount: response.data.notificationsPageCount})
    setNotifications(response.data)
    const seenNotifications = response.data.notifications
    .filter(notification => notification.seen)
    .map(notification => notification.id)
    setSeenNotifications(seenNotifications)
      } catch (error) {
        setError('Could not get notifications')
        setShowError(true)
      }
    }
    GetFriendRequests()
    GetNotifications()
  }, [location])
  useEffect(() => {
    if (notifications.notifications && notifications.notifications.length <= 0 && pageData.pageCount !== 0) {
      const newPage = pageData.currentPage - 1 <= 0 ? 0 : pageData.currentPage - 1
      setPageData(prevPageData => ({
        ...prevPageData,
        currentPage: newPage,
        pageCount: prevPageData.pageCount - 1 <= 0 ? 0 : prevPageData.pageCount
      }))
      navigate(`/notifications?page=${newPage}`)
    }
  }, [notifications])
  
  return (
    <>
      <Navigation removeId={removeId}/>
      <Container fluid data-bs-theme='dark'>
      {showError ? <div className='text-center'><span className='invalid'>{error}</span></div> : null}
        <Tab.Container id='left-tabs-example' defaultActiveKey='requests'>
          <Col>
            <Row>
              <Tab.Content>
                <Tab.Pane eventKey='requests'>
                  {requestsList && requestsList.length <= 0 ? 'No friend requests.' : requestsList}
                  <Row>
                    <Pagination className='justify-content-center custom-pagination mb-5 mt-3'>
                      <Pagination.First onPointerDown={()=>handlePaginationPointerDown(1)}/>
                      <Pagination.Prev onPointerDown={()=>handlePaginationPointerDown(pageData.currentPage-1 <= 0 ? pageData.pageCount : pageData.currentPage-1)}/>
                        {pages}
                      <Pagination.Next onPointerDown={()=>handlePaginationPointerDown(pageData.currentPage+1 > pageData.pageCount ? 1 : pageData.currentPage+1)}/>
                      <Pagination.Last onPointerDown={()=>handlePaginationPointerDown(pageData.pageCount)}/>
                    </Pagination>
                  </Row>
                </Tab.Pane>
                <Tab.Pane eventKey='notifications'>
                  {listItems && listItems.length <= 0 ? 'No notifications.' : listItems}
                  <Row>
                    <Pagination className='justify-content-center custom-pagination mb-5 mt-3'>
                      <Pagination.First onPointerDown={()=>handlePaginationPointerDown(1)}/>
                      <Pagination.Prev onPointerDown={()=>handlePaginationPointerDown(pageData.currentPage-1 <= 0 ? pageData.pageCount : pageData.currentPage-1)}/>
                        {pages}
                      <Pagination.Next onPointerDown={()=>handlePaginationPointerDown(pageData.currentPage+1 > pageData.pageCount ? 1 : pageData.currentPage+1)}/>
                      <Pagination.Last onPointerDown={()=>handlePaginationPointerDown(pageData.pageCount)}/>
                    </Pagination>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Row>
            <Row>
              <Nav
                className='p-0 fixed-bottom justify-content-center'
                style={{ backgroundColor: '#343a40' }}
              >
                <Col>
                  <Row className='justify-content-center'>
                    <Col className='text-center p-0' style={{maxWidth: 'fit-content'}}>
                      <Nav.Item>
                        <Nav.Link
                          className='custom-tab secondary'
                          eventKey='requests'
                        >
                          Friend requests
                        </Nav.Link>
                      </Nav.Item>
                    </Col>
                    <Col className='text-center p-0' style={{maxWidth: 'fit-content'}}>
                      <Nav.Item>
                        <Nav.Link
                          className='custom-tab secondary'
                          eventKey='notifications'
                        >
                          Notifications
                        </Nav.Link>
                      </Nav.Item>
                    </Col>
                  </Row>
                </Col>
              </Nav>
            </Row>
          </Col>
        </Tab.Container>
      </Container>
    </>
  )
}
export default Notifications