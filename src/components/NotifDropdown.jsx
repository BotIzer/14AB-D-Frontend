import { useEffect, useRef, useState } from 'react'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'

function NotifDropdown(props) {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const [notifications, setNotifications] = useState([])
  const [dropdownWidth, setDropdownWidth] = useState(250)


  const notifs = notifications.notifications && notifications.notifications.map((notif) => (
    <Dropdown.Item
      key={notif.id}
      className='list-group-item secondary text-center'
      onPointerDown={() => navigate(`/notifications/${notif.id}`)}
    >
      {`${notif.text.substring(0,Math.floor(dropdownWidth/16))}...`}
    </Dropdown.Item>
  ))

  useEffect(()=>{
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
        setNotifications(response.data)
      } catch (error) {
        setNotifications('Could not retrieve notifications')
      }
    }
    GetNotifications()
  },[])
  useEffect(()=>{
    if(notifications.notifications && props.removeId !== ''){
      const updatedNotifications = notifications.notifications.filter((notification) => notification.id !== props.removeId)
  setNotifications(prevState => ({
  ...prevState,
  notifications: updatedNotifications
}))
    }
  },[props])
  useEffect(()=>{
    const updateDropdownWidth = () => {
      if (dropdownRef.current) {
        const width = dropdownRef.current.offsetWidth
        setDropdownWidth((prevWidth) => (prevWidth === 0 ? 250 : width))
      }
    }
    updateDropdownWidth()
  window.addEventListener('resize', updateDropdownWidth)
  return () => {
    window.removeEventListener('resize', updateDropdownWidth)
  }
  },[dropdownRef])

  return (
    <>
      <DropdownButton
        style={{ maxWidth: '35vw' }}
        data-bs-theme='dark'
        title='Notifications'
        className='dropdown-button dropdown-button-size my-2 mx-2'
        ref={dropdownRef}
      >
        {notifs}
        <Dropdown.Divider />
        <Dropdown.Menu>
        <Dropdown.Item
          eventKey='4'
          onPointerDown={() =>
            navigate('/notifications?page=1')
          }
          onMouseEnter={() =>
            (document.getElementById('notification').className =
              'my-auto filter-black')
          }
          onMouseLeave={() =>
            (document.getElementById('notification').className =
              'my-auto filter-gold')
          }
        >
          See more ({(notifications.notifications && notifications.notifications.length) || 0}){' '}
          <img
            id='notification'
            src={import.meta.env.VITE_NOTIFS}
            alt='notifications'
            className='my-auto filter-gold'
          />
        </Dropdown.Item>
        </Dropdown.Menu>
      </DropdownButton>
    </>
  )
}

export default NotifDropdown
