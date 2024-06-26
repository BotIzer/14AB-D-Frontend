import {
  Accordion,
  AccordionContext,
  Card,
  useAccordionButton,
  ToggleButton,
  Row,
  Col,
  Button,
  Container,
  Form
} from 'react-bootstrap'
import { DaysDifference } from './ForumCard'
import { Link } from 'react-router-dom'
import React, { useContext, useEffect, useState } from 'react'
import axios from '../api/axios'

function CommentAccordion(props) {
  
  const [isLiked, setIsLiked] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  const ContextAwareToggle = ({ children, eventKey, callback }) => {
    const { activeEventKey } = useContext(AccordionContext)

    const decoratedonClick = useAccordionButton(
      eventKey,
      () => callback && callback(eventKey)
    )

    const isCurrentEventKey = activeEventKey === eventKey

    return (
      <button
        style={{ width: '30px', height: '30px' }}
        className='m-2'
        type='button'
        onClick={decoratedonClick}
      >
        {isCurrentEventKey ? '-' : '+'}
      </button>
    )
  }
  const editComment = async () =>{
    await axios.patch(`/comment/${props.comment._id.message_id}`,
    {
      text: document.getElementById('commentForm').value,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true,
    })
    props.comment.text = document.getElementById('commentForm').value
    setIsEditing(false)
  }
  const deleteComment = async () =>{
    await axios.delete(`/comment/${props.comment._id.message_id}`,
  {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    withCredentials: true,
  })
  props.delete()
  }
  useEffect(()=>{
    const getOwner = async() => {
      if(JSON.parse(localStorage.getItem('userInfo')).username === null){
        setIsOwner(false)
        return
      }
      const userResponse = await axios.get(
        `/user/${JSON.parse(localStorage.getItem('userInfo')).username}`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      if(props.comment._id.creator_id !== userResponse.data.user._id){
        setIsOwner(false)
      }
      else{
        setIsOwner(true)
      }
    }
    getOwner()
  },[])
  return (
    <>
      <Container style={props.style} className={props.className} fluid>
        <Accordion data-bs-theme='dark' defaultActiveKey='0'>
          <Card>
            <Card.Header className='text-muted w-100 p-0 m-0' as={Row}>
              <Col className='text-nowrap p-0'>
                <ContextAwareToggle eventKey='0'>+</ContextAwareToggle>
                <i style={{ fontSize: 'small' }}>
                  <Link className='chat-name secondary' to={`/user/${props.comment.creator}`}>
                    {props.comment.creator}
                  </Link>{' '}
                  - {DaysDifference(props.comment.creation_date, Date.now())}{' '}
                  days ago
                </i>
              </Col>
            </Card.Header>
            <Accordion.Collapse eventKey='0'>
              <Card.Body className='text-wrap' style={{ paddingBottom: '0px' }}>
                { !isEditing ? props.comment.text :
                <Form.Control defaultValue={props.comment.text} id='commentForm'></Form.Control>}
                <Row
                  style={{ fontSize: 'small', borderTop: '3px solid #44454c' }}
                  className='text-center p-2'
                >
                  <Col>
                    {isOwner ? (!isEditing ? 
                    <React.Fragment>
                      <Button
                      variant='outline-warning'
                      className='custom-button'
                      style={{ fontSize: 'small', border: 'gold solid 1px' }}
                      onClick={()=>setIsEditing(true)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant='outline-warning'
                      className='custom-button'
                      style={{ fontSize: 'small', border: 'gold solid 1px', color: 'red'}}
                      onClick={()=>deleteComment()}
                    >
                      Delete
                    </Button> 
                    </React.Fragment>
                    :
                    <React.Fragment>
                      <Button
                    variant='outline-warning'
                    className='custom-button'
                    style={{ fontSize: 'small', border: 'gold solid 1px' }}
                    onClick={()=>editComment()}
                  >
                    Save
                  </Button>
                  <Button
                  variant='outline-warning'
                  className='custom-button'
                  style={{ fontSize: 'small', border: 'gold solid 1px' }}
                  onClick={()=>setIsEditing(false)}
                >
                  Close Editing
                </Button>
                    </React.Fragment>) : null}
                  </Col>
                </Row>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </Container>
    </>
  )
}
export default CommentAccordion
