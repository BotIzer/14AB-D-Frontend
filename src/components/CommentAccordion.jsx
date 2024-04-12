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
} from 'react-bootstrap'
import { DaysDifference } from './ForumCard'
import { Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'

function CommentAccordion(props) {
  
  const [isLiked, setIsLiked] = useState(false)
  const [creatorName, setCreatorName] = useState('')

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

  const LikedThread = () => {
    if (opinion.isLiked) {
      setOpinion({
        threadId: post.post._id.thread_id,
        isLiked: false,
        isDisLiked: false,
        userToken: localStorage.getItem('token'),
      })
    } else {
      setOpinion({
        threadId: post.post._id.thread_id,
        isLiked: true,
        isDisLiked: false,
        userToken: localStorage.getItem('token'),
      })
    }
  }

  const DislikedThread = () => {
    if (opinion.isDisLiked) {
      setOpinion({
        threadId: post.post._id.thread_id,
        isLiked: false,
        isDisLiked: false,
        userToken: localStorage.getItem('token'),
      })
    } else {
      setOpinion({
        threadId: post.post._id.thread_id,
        isLiked: false,
        isDisLiked: true,
        userToken: localStorage.getItem('token'),
      })
    }
  }
  useEffect(()=>{
    console.log(props)
  },[])
  //TODO make togglebuttons work plz :)
  return (
    <>
    {/*TODO:  Add style style={props.style} className={props.className}*/}
      <Container fluid>
        <Accordion data-bs-theme='dark' defaultActiveKey='0'>
          <Card>
            <Card.Header className='text-muted w-100 p-0 m-0' as={Row}>
              <Col className='text-nowrap p-0'>
                <ContextAwareToggle eventKey='0'>+</ContextAwareToggle>
                <i style={{ fontSize: 'small' }}>
                  <Link className='chat-name secondary'>
                    {props.comment.creator}
                  </Link>{' '}
                  - {DaysDifference(props.comment.creation_date, Date.now())}{' '}
                  days ago
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
                  checked={isLiked}
                  value='1'
                  onChange={() => LikedThread()}
                >
                  <img
                    src='/src/assets/icons/lightning_32_up.png'
                    alt='fist-bump'
                    className={isLiked ? 'filter-gold' : 'filter-grey'}
                  />
                  <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary'>
                    {props.comment.likes.count}
                  </span>{' '}
                </ToggleButton>
                <ToggleButton
                  // id={post.post._id && post.post._id.thread_id + 'dislike'}
                  id={2}
                  className='image-checkbox position-relative'
                  type='checkbox'
                  variant='secondary'
                  // checked={opinion.isDisLiked}
                  checked={!isLiked}
                  value='1'
                  onChange={() => DislikedThread()}
                >
                  <img
                    src='/src/assets/icons/lightning_32.png'
                    alt='skull'
                    className={!isLiked ? 'filter-red' : 'filter-grey'}
                  />
                  <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary'>
                    {props.comment.dislikes.count}
                  </span>
                </ToggleButton>
              </Col>
            </Card.Header>
            <Accordion.Collapse eventKey='0'>
              <Card.Body className='text-wrap' style={{ paddingBottom: '0px' }}>
                {props.comment.text}
                <Row
                  style={{ fontSize: 'small', borderTop: '3px solid #44454c' }}
                  className='text-center p-2'
                >
                  <Col>
                    <Button
                      variant='outline-warning'
                      className='custom-button'
                      style={{ fontSize: 'small', border: 'gold solid 1px' }}
                    >
                      Edit
                    </Button>
                  </Col>
                  {/* TODO make second button show  options, make replies open chatwindow*/}
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
