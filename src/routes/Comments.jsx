import { useEffect, useState, useContext} from 'react'
import CommentAccordion from '../components/CommentAccordion'
import Navigation from '../components/Navigation'
import PostCard from '../components/PostCard'
import {Container, Row, Col, Accordion, Card, Form, Button, AccordionContext, useAccordionButton} from 'react-bootstrap'
import axios from '../api/axios'
import {Link, useLocation} from 'react-router-dom'

function Comments() {
  const location = useLocation()
  const [threadData, setThreadData] = useState()
  const [comments, setComments] = useState([])
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)

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
const getCommentData = async() => {
  try {
    const response = await axios.get(`/thread/${location.pathname.split('/')[4]}/comments`,{
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true,
    })
    setComments(response.data)
  } catch (error) {
    setError('Couldnt load comments!')
    setShowError(true)
  }
}
const commentList = comments && comments.map((comment) => (
  <Row key={comment._id.message_id} className='justify-content-center my-3'>
    <CommentAccordion delete={()=>getCommentData()} comment={comment}></CommentAccordion>
  </Row>
))
const sendComment = async () =>{
  if(document.getElementById('comment').value.trim() !== ''){
    try {
      await axios.post('/thread/createComment',{
        thread_id: location.pathname.split('/')[4],
        text: document.getElementById('comment').value.trim(),
        is_reply: false
      })
    } catch (error) {
      setError('Couldnt post comment!')
      setShowError(true)
    }
  document.getElementById('comment').value = ''
  getCommentData()
  }else{
    setError('Cant post empty comment!')
    setShowError(true)
  }
    
}
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
      setError('Couldnt load thread information!')
      setShowError(true)
    }
  }
  getCommentData()
  GetThreadData()
},[])
return (
  <>
  <Navigation/>
  {showError ? <Row className='w-100 mx-auto justify-content-center text-center text-danger fw-bold' style={{backgroundColor: 'rgba(220,53,69, 0.5)'}}><p className='w-auto' autoFocus>ERROR:{error}</p></Row> : null}
   <Container fluid>
     <Col xs='auto'>
       <Row className='justify-content-center m-2 mb-4'>
         {threadData ? <PostCard isDisabled={true} post={threadData}></PostCard> : null}
       </Row>
       {localStorage.getItem('userInfo') !== null ? <Row>
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
            </Card.Header>
            <Accordion.Collapse eventKey='0'>
              <Card.Body>
                <Row className='justify-content-center m-0'>
                  <Form.Control id='comment' className='m-2' placeholder='Write your comment here'>
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
                      onClick={()=>sendComment()}
                    >
                      Add Comment
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
       </Row> : null}
       {commentList}
     </Col>

   </Container>
  </>
)
}

export default Comments