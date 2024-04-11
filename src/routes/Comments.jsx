import { useEffect, useState, useContext} from 'react'
import CommentAccordion from '../components/CommentAccordion'
import Navigation from '../components/Navigation'
import PostCard from '../components/PostCard'
import {Container, Row, Col, Accordion, Card, ToggleButton, Form, Button, AccordionContext, useAccordionButton} from 'react-bootstrap'
import axios from '../api/axios'
import {Link} from 'react-router-dom'

function Comments() {
  //TODO Replace dummyData
  const [threadData, setThreadData] = useState()
  const dummyCreator = {
    _id: 1,
    name: 'Béla',
  }
  const dummyComments = [
    {
      _id: {
        room_id: 1,
        creator_id: 1,
        message_id: 1,
      },
      text: 'Nem dolgozol eleget',
      reply: {
        is_reply: false,
        parent_comment_id: null,
        sequential_number: 0,
      },
      creation_date: Date.now(),
      likes: 10,
      dislikes: 2,
      emoticons: [],
    },
    {
      _id: {
        room_id: 2,
        creator_id: 2,
        message_id: 2,
      },
      text: 'Mé nem',
      reply: {
        is_reply: false,
        parent_comment_id: null,
        sequential_number: 0,
      },
      creation_date: Date.now(),
      likes: 10,
      dislikes: 2,
      emoticons: [],
    }
  ]
  const dummyPost = {
    _id: {
      forum_id: 1,
      creator_id: 1,
      thread_id: 1,
  },
  name: 'title',
  likes: {
      count: 2,
      users: ['MN', 'Béla'],
  },
  dislikes: {
      count: 1,
      users: ['BotIzer'],
  },
  editors: ['Béla'],
  emoticons: [''],
  creation_date:  Date.now,
  content: 'Béla munkaideje',
  image_array: [''],
}

const ContextAwareToggle = ({ children, eventKey, callback }) => {
  const { activeEventKey } = useContext(AccordionContext)

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey)
  )

  const isCurrentEventKey = activeEventKey === eventKey

  return (
    <button
      style={{ width: '30px', height: '30px' }}
      className='m-2'
      type='button'
      onClick={decoratedOnClick}
    >
      {isCurrentEventKey ? '-' : '+'}
    </button>
  )
}

const commentList = dummyComments.map((comment) => (
  <Row key={comment._id.message_id} className='justify-content-center my-3'>
    <CommentAccordion comment={comment} creator={dummyCreator}></CommentAccordion>
  </Row>
))
//TODO Get replace dummy Creator
useEffect(()=>{
  
  const GetThreadData = async() => {
    try {
      const response = await axios.get(`/thread/${location.pathname.split('/')[4]}`,
      { headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true,
      })
      setThreadData(response.data)
    } catch (error) {
      //TODO: error handling
    }
  }
  GetThreadData()
},[])
return (
  <>
  <Navigation/>
   <Container fluid>
     <Col xs='auto'>
       <Row className='justify-content-center m-2 mb-4'>
         <PostCard isDisabled={true} post={(threadData !== undefined ? threadData : dummyPost)}></PostCard>
       </Row>
       <Row>
       <Accordion data-bs-theme='dark' defaultActiveKey='0' className='mb-2'>
          <Card>
            <Card.Header className='text-muted w-100 p-0 m-0' as={Row}>
              <Col className='text-nowrap p-0'>
                <ContextAwareToggle eventKey='0'>+</ContextAwareToggle>
                <i style={{ fontSize: 'small' }}>
                  <Link className='chat-name secondary' to={`/user/${JSON.parse(localStorage.getItem('userInfo')).username}`}>
                    {localStorage.getItem('userInfo')!== null? JSON.parse(localStorage.getItem('userInfo')).username : ''}
                  </Link>{' '}
                  - Now
                </i>
              </Col>
              <Col className='text-end'>
                <ToggleButton
                  // id={post.post._id && post.post._id.thread_id + 'like'}
                  id={1}
                  className='image-checkbox position-relative'
                  type='checkbox'
                  variant='secondary'
                  // checked={opinion.isLiked}
                  disabled
                  value='1'
                >
                  <img
                    src='/src/assets/icons/lightning_32_up.png'
                    alt='fist-bump'
                    className='filter-grey'
                  />
                  <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary'>
                    0
                  </span>{' '}
                </ToggleButton>
                <ToggleButton
                  // id={post.post._id && post.post._id.thread_id + 'dislike'}
                  id={2}
                  className='image-checkbox position-relative'
                  type='checkbox'
                  variant='secondary'
                  // checked={opinion.isDisLiked}
                  disabled
                  value='1'
                >
                  <img
                    src='/src/assets/icons/lightning_32.png'
                    alt='skull'
                    className='filter-grey'
                  />
                  <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary'>
                    0
                  </span>
                </ToggleButton>
              </Col>
            </Card.Header>
            <Accordion.Collapse eventKey='0'>
              <Card.Body>
                <Row className='justify-content-center m-0'>
                  <Form.Control className='m-2' placeholder='Write your comment here'>
                  </Form.Control>
                </Row>
                <Row
                  style={{ fontSize: 'small', borderTop: '3px solid #44454c' }}
                  className='text-center'
                >
                  <Col>
                    <Button
                      variant='outline-warning'
                      className='custom-button mt-3'
                      style={{ fontSize: 'small', border: 'gold solid 1px' }}
                    >
                      Add Comment
                      {/*TODO onclick add comment*/}
                    </Button>
                  </Col>
                  {/* TODO make second button show  options, make replies open chatwindow*/}
                </Row>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
       </Row>
       {commentList}
     </Col>

   </Container>
  </>
)
}

export default Comments