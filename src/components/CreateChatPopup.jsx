import {
  Row,
  Col,
  FormGroup,
  Form,
  Button,
} from 'react-bootstrap'
import { useEffect, useState } from 'react'
import React from 'react'
import axios from '../api/axios'

function CreateChatPopup(props) {
  const [isTemporary, setIsTemporary] = useState(false)
  const [showError, setShowError] = useState(false)
  const [friendList, setFriendList] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [groupMembers, setGroupMembers] = useState([])

  const addFriends = friendList.map((friend) => (
    <Row key={friend.username} className='border border-secondary text-nowrap w-100 mx-auto'>
      <Col className='p-2 text-start'>
      <Button variant='outline-warning' onPointerDown={()=>groupMembers.includes(friend.username) ? setGroupMembers(groupMembers.filter(member => member !== friend.username))
      : setGroupMembers([...groupMembers, friend.username])}>
        {groupMembers.includes(friend.username) ? "-" : "+"}</Button>{friend.username}
      </Col>
    </Row>
  ))
  const CreateGroupChat = async () => {
    if (document.getElementById('groupName').value.trim() === '') {
      setShowError(true)
      return
    }
    try {
      const groupName = document.getElementById('groupName').value.trim()
      const daysToDie = document.getElementById('daysToLive').value
      await axios.post(
        '/chat',
        {
          name: groupName,
          is_ttl: isTemporary,
          days_to_die: daysToDie,
          is_private: false,
          usernames: groupMembers,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      )
      props.close()
    } catch (error) {
      setShowError(true)
      setErrorMessage(error.response.message)
    }
  }
  const CloseChat = () => {
    if (confirm('Are you sure you want to close the chat?')) {
      document.getElementById('groupName').value = ''
      setIsTemporary(false)
      props.close()
    }
  }

  useEffect(() => {
    document.getElementById('daysToLive').value = ''
  }, [isTemporary])
  useEffect(()=>{
    const GetFriends = async () => {
      try {
        const response = await axios.get('/friends', {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        })
        setFriendList(response.data.returnFriends)
        console.log(response.data.returnFriends)
      } catch (error) {
        setShowError(true)
        setErrorMessage(error.response.message)
      }
    }
    GetFriends()
  },[])
  return (
    <>
      <Row className='mx-auto text-center'>
        {showError ? <Row className='w-100 mx-auto justify-content-center text-center text-danger fw-bold' style={{backgroundColor: 'rgba(220,53,69, 0.5)'}}><p className='w-auto' autoFocus>ERROR:{errorMessage}</p></Row> : null}
        <FormGroup data-bs-theme='dark'>
          <Form.Label className='secondary'>Group Name</Form.Label>
          <Form.Control
            placeholder='My Group'
            className='mx-auto'
            id='groupName'
          ></Form.Control>
        </FormGroup>
        <FormGroup>
          <Form.Label className='secondary'>Participants</Form.Label>
          <Col
            style={{ maxHeight: '280px' }}
            className='overflow-auto mx-auto custom-border my-3'
          >
            {addFriends}
          </Col>
        </FormGroup>
        <FormGroup data-bs-theme='dark'>
          <Form.Check
            className='d-flex justify-content-center mx-auto secondary'
            type='checkbox'
            label='temporary?'
            id='isTemporary'
            onChange={(event) => setIsTemporary(event.target.checked)}
            checked={isTemporary}
          ></Form.Check>
          <Form.Label className='secondary'>
            Expiration interval (days)
          </Form.Label>
          <Form.Control
            disabled={!isTemporary}
            id='daysToLive'
            placeholder='e.g: 3'
            className='mx-auto'
          ></Form.Control>
        </FormGroup>
      </Row>
      <Row className='mx-auto text-center'>
        <Col>
          <Button
            variant='outline-warning'
            size='lg'
            onClick={() => CreateGroupChat()}
            className='mt-3'
          >
            Create
          </Button>
        </Col>
        <Col>
          <Button
            variant='outline-danger'
            size='lg'
            onClick={() => CloseChat()}
            className='mt-3'
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default CreateChatPopup