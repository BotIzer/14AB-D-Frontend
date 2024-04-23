
import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import axios from '../api/axios'
import NotifDropdown from './NotifDropdown'
import { Dropdown, Image, Container, Nav, Navbar, Form } from 'react-bootstrap'
import {NotificationContext} from '../main'
function Navigation(props) {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [dropdownWidth, setDropdownWidth] = useState(0)
  const [pageDetails, setPageDetails] = useState({
    currentPage: parseInt(location.search.split('page=')[1]) || 0,
    limit: parseInt(location.search.split('limit=')[1]) || 10
  })
  const [searchResults, setSearchResults] = useState({forums: [], users: []})
  const [timerOff, setTimerOff] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const {forumData, setForumData} = useContext(NotificationContext)

  const [notifications, setNotifications] = useState([])
  const [removeId, setRemoveId] = useState(props.removeId)
  

  const textStyle = {
    color: 'gold',
    fontSize: '20px',
  }
  

  const handleKeyDown = (event) => {
    event.preventDefault()
    if(inputValue.trim() === ''){
      return
    }
    RedirectToLink()
  }
  const RedirectToLink = async () => {
    try {
      const response = await axios.post(
        '/search',
        {
          keyword: inputValue,
        },
        {
          params: {
            page: pageDetails.currentPage,
            limit: pageDetails.limit
          },
          headers: { 'Content-Type': 'application/json' },
        }
      )
      
      for (let index = 0; index < response.data.length; index++) {
        if (response.data[index][0] !== undefined) {
          if(response.data[index][0].forum_name !== undefined){
            navigate(`/forums/${response.data[index][0].forum_name}/${response.data[index][0]._id.forum_id}?page=1`)
            break
          }
          else if(response.data[index][0].username !== undefined){
            navigate(`/user/${response.data[index][0].username}`)
            break
          }
        }
      }
    } catch (error) {
      if (error != '') {
        return <ErrorPage errorStatus={error} />
      }
    }
  }
  const HandleLogout = async () => {
    setIsLoggedIn(false)
    localStorage.clear()
    dispatchEvent(new Event('storage'))
  }

  useEffect(()=>{
    const updateDropdownWidth = () => {
      if (dropdownRef.current) {
        const width = dropdownRef.current.offsetWidth
        setDropdownWidth(width)
      }
    }
    updateDropdownWidth()
  window.addEventListener('resize', updateDropdownWidth)
  return () => {
    window.removeEventListener('resize', updateDropdownWidth)
  }
  },[dropdownRef.current])
  useEffect(() => {
    setTimerOff(false)
    const timer = setTimeout(async () => {
      try {
        if (inputValue.trim() !== '') {
          const response = await axios.post(
            '/search',
            {
              keyword: inputValue,
            },
            {
              params: {
                page: pageDetails.currentPage,
                limit: pageDetails.limit
              },
              headers: { 'Content-Type': 'application/json' },
            }
          )
          let temporaryForumArray = []
          let temporaryUserArray = []
          response.data[0].forEach(element => {
            temporaryForumArray.push({
              id: element._id.forum_id,
              name: element.forum_name
            })
          })
          response.data[1].forEach(element => {
            temporaryUserArray.push({
              name: element.username
            })
          })
          setSearchResults({forums: temporaryForumArray, users: temporaryUserArray})
          setTimerOff(true)
        }
      } catch (error) {
        setTimerOff(true)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [inputValue])

  const HandleSearchNavigation = (route)=>{
    navigate(route + '?page=1')
  }
  useEffect(()=>{
    setRemoveId(props.removeId)
  },[props])

  useEffect(() => {
    setIsLoggedIn(
      localStorage.getItem('token') !== null && localStorage.getItem('userInfo') !== null
    )
    addEventListener('storage', () => {
      setIsLoggedIn(
        localStorage.getItem('token') !== null && localStorage.getItem('userInfo') !== null
      )
      navigate('/')
    })
    const GetNotifications = async ()=>{
      try {
        const response = await axios.get('/notification',
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        })
        setNotifications(response.data)
      } catch (error) {
        setNotifications(['Could not retrieve notifications'])
      }
    }
    if(localStorage.getItem('token') !== null){
      GetNotifications()
    }
  }, [])
  return (
    <Navbar
      expand='lg'
      className='bg-body-tertiary sticky overflow-responsive'
      bg='dark'
      data-bs-theme='dark'
      sticky='top'
    >
      <Container fluid>
        <Nav.Link style={textStyle} onClick={() => navigate('/')}>
          BlitzForFriends <Image src={import.meta.env.VITE_LOGO} style={{width: '64px', height: '64px'}}></Image>
        </Nav.Link>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            {isLoggedIn ? <Nav.Link
              style={textStyle}
              className='mx-2 my-auto'
              onClick={() => navigate('/chats')}
            >
              Chats
            </Nav.Link> : <Nav.Link style={textStyle} className='mx-2 my-auto' onClick={() =>navigate('/credits')}>Credits</Nav.Link>}
              {isLoggedIn ? <NotifDropdown removeId={removeId} setForumData={()=>setForumData({...forumData, hasSent: true})} notificationData={forumData}></NotifDropdown> : null}
          </Nav>
          <Nav
            style={{ width: '100%' }}
            className='mx-auto justify-content-center'
          >
            <Form className='custom-mw mx-2' onSubmit={handleKeyDown}>
              <Form.Control
                type='text'
                placeholder='Search'
                className='mt-2 mt-md-0'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ fontSize: '16px' }}
                onFocus={()=>setShowSearchResults(true)} 
                onBlur={()=>setShowSearchResults(false)}
              />
            <Dropdown show={inputValue.trim() !== '' && showSearchResults}>
            <Dropdown.Menu className='custom-mw' ref={dropdownRef}>
      {searchResults.users.length > 0 && searchResults.users.map((item) => (
        <Dropdown.Item onClick={()=>HandleSearchNavigation(`/user/${item.name}`)} className='d-flex justify-content-center'  key={item.name}>{item.name.length > 25 ? `${item.name.substring(0,13)}... (user)` : `${item.name} (user)`}</Dropdown.Item>
      ))}
      {searchResults.forums.length > 0 && searchResults.forums.map((item) => (
        <Dropdown.Item onClick={()=>HandleSearchNavigation(`/forums/${item.name}/${item.id}`)} className='d-flex justify-content-center'  key={item.name}>{item.name.length > 25 ? `${item.name.substring(0,13)}... (forum)` : `${item.name} (forum)`}</Dropdown.Item>
      ))}
          {searchResults.users.length == 0 && searchResults.forums.length == 0 && timerOff && <Dropdown.Item className='d-flex justify-content-center'  key='noResults'>No search results</Dropdown.Item>}
           </Dropdown.Menu>
            </Dropdown>
            </Form>
          </Nav>
          <Nav>
            <Nav.Link
              style={textStyle}
              className='mx-2 my-2'
              onClick={() => navigate('/forums?page=1')}
            >
              Forums
            </Nav.Link>
            {isLoggedIn ? (
              <React.Fragment>
                <Nav.Link
                  style={textStyle}
                  className='mx-2 my-2'
                  onClick={() =>
                    navigate(
                      `/user/${
                        JSON.parse(localStorage.getItem('userInfo')).username
                      }`
                    )
                  }
                >
                  {JSON.parse(localStorage.getItem('userInfo')).username}
                </Nav.Link>
              </React.Fragment>
            ) : null}
            {isLoggedIn ? (
              <React.Fragment>
                <Nav.Link
                  style={textStyle}
                  className='mx-2 my-2'
                  id='logoutBtn'
                  onClick={() =>
                    window.confirm('Are you sure you want to log out?')
                      ? HandleLogout()
                      : null 
                  }
                >
                  Logout
                </Nav.Link>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Nav.Link
                  style={textStyle}
                  className='mx-2 my-2'
                  onClick={() => navigate('/login')}
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  style={textStyle}
                  className='mx-2 my-2'
                  onClick={() => navigate('/register')}
                >
                  Register
                </Nav.Link>
              </React.Fragment>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation
