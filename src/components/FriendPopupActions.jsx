import { Button, Row } from 'react-bootstrap'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'

function FriendPopupActions(props) {
  const navigate = useNavigate()
  const [isOwner, setIsOwner] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const removeFriend = async () =>{
    try {
      await axios.delete(
        `/friend/${props.friend}`,
        {
          friendName: props.friend,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      )
      props.remove()
    } catch (error) {
      setShowError(true)
      setErrorMessage(error.response.message)
    }
  }
  const GoToProfile = async () => {
    navigate(`/user/${props.friend}`)
  }
  const ListMembers = async () =>{
    try{
      const response = await axios.get(`/chat/${props.selectedChat}`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true
      })
      let tempMembers = []
      for (let index = 0; index < response.data.chat.users.length; index++) {
        const element = response.data.chat.users[index].user_id;
        try{
          const response = await axios.get(`/user/data/${element}`,
          {
            headers:{
              'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true
          })
          tempMembers.push(response.data.username)
        } catch(error){
          setShowError(true)
          setErrorMessage(error.response.message)
        }
      }
      const creator = await axios.get(`/user/data/${response.data.chat.owner}`,
          {
            headers:{
              'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true
          })
      tempMembers.push(creator.data.username)
      props.show(tempMembers)
    }
    catch(error){
      setShowError(true)
      setErrorMessage(error.response.message)
    }
  }
  const LeaveChat = async () =>{
    try {
      await axios.post(
        '/chat/leaveChat',
        {
          chat_id: props.selectedChat
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      )
      props.remove()
    } catch (error) {
      setShowError(true)
      setErrorMessage(error.response.message)
    }
  }
  const DeleteChat = async () => {
    try {
      await axios.delete(
        `/chat/${props.selectedChat}`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      )
    } catch (error) {
      setShowError(true)
      setErrorMessage(error.response.message)
    }
  }
  useEffect(()=>{

    try {
      const GetSelfId = async ()=>{
        const userId = await axios.get(`/username/${JSON.parse(localStorage.getItem('userInfo')).username}`,
      {
        headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true})
      if(props.owners[props.selectedChat] === userId.data._id){
        setIsOwner(true)
      }
      }
    } catch (error) {
      setShowError(true)
      setErrorMessage(error.response.message)
    }

  },[])
  return (
    <div data-bs-theme='dark' className='list-group list-group-flush h-100'>
      <p className='list-group-item secondary w-100 p-2 text-center mb-0' style={{borderBottom: '1px solid #e8cc80'}}>{props.name}</p>
      
      {props.type == 'direct' && <React.Fragment>
      <Button
      className='border rounded-0 list-group-item secondary h-100 w-100 p-2 custom-button'
      key={'Profile'}
      onClick={()=> GoToProfile()}
    >
      Profile
    </Button>
      </React.Fragment>}
      {props.type == 'friend' &&
        
      <React.Fragment>
      <Button
      className='border rounded-0 list-group-item secondary h-100 w-100 p-2 custom-button'
      key={'Profile'}
      onClick={()=> GoToProfile()}
    >
      Profile
    </Button>
    <Button
      className='border rounded-0 list-group-item secondary h-100 w-100 p-2 custom-button'
      key='removeFriend'
      onClick={()=> removeFriend()}
    >
      Remove Friend
    </Button>
    </React.Fragment>}
    {props.type != 'friend' && props.type != 'direct' && <React.Fragment>
      <Button
      className='border rounded-0 list-group-item secondary h-100 w-100 p-2 custom-button'
      key={'Profile'}
      onClick={()=> ListMembers()}
    >
      See members
    </Button>
    <Button
      className='border rounded-0 list-group-item secondary h-100 w-100 p-2 custom-button'
      key='LeaveChat'
      onClick={()=> LeaveChat()}
    >
      Leave Chat
    </Button>
    {isOwner? <Button
      className='border rounded-0 list-group-item secondary h-100 w-100 p-2 custom-button'
      key='DeleteChat'
      onClick={()=> DeleteChat()}
    >
      Delete Chat
    </Button> : null}
    </React.Fragment>
    }
    {showError ? <Row className='w-100 mx-auto justify-content-center text-center text-danger fw-bold' style={{backgroundColor: 'rgba(220,53,69, 0.5)'}}><p className='w-auto' autoFocus>ERROR:{errorMessage}</p></Row> : null}

    </div>
  )
}

export default FriendPopupActions
