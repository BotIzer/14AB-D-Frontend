import 'bootstrap/dist/css/bootstrap.min.css'
import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import axios from '../api/axios'

function FriendMenu(props) {
    const [friends, setFriends] = useState([])
    const [chat, setChat] = useState(null)
    const [showError, setShowError] =  useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const AddToChat = async (friend) =>{
        try {
          await axios.post(
            '/chat/addFriend',
            {
              friendName: friend,
              chat_id: props.chat,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${localStorage.getItem('token')}`,
              },
              withCredentials: true,
            })
        } catch (error) {
          setErrorMessage(error.response.message)
          setShowError(true)
        }
      }
      const listItems = friends.map((friend) => (
        <Button
            key={friend}
            onClick={() => AddToChat(friend)}>
            {friend}
        </Button>
    ))
    useEffect(() => {
      setChat(props.chat)
        async function GetFriends() {
            try {
                const response = await axios.get('/friends', {
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    withCredentials: true,
                }
                )
                response.data.length !== 0 ? setFriends(response.data) : setFriends(['No friends? :('])
            } catch (error) {
                console.error('Error fetching friends:', error)
            }
            
        }
        
        GetFriends()
    }, [])
  return (
    <div
      data-bs-theme='dark'
      className='list-group list-group-flush p-2 h-100 overflow-auto custom-border'
    >
      <p className='text-center'>Online</p>
      {listItems}
    </div>
  )
}

export default FriendMenu