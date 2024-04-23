import { useNavigate } from 'react-router-dom'
import { Card, Button, Col, Row, ToggleButton, DropdownButton, Dropdown, DropdownDivider } from 'react-bootstrap'
import { DaysDifference } from './ForumCard'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import MyCarousel from '../components/MyCarousel'
import axios from '../api/axios'

function PostCard(post) {
  const navigate = useNavigate()
  const [opinion,setOpinion] = useState({isLiked: localStorage.getItem('userInfo') !== null && 
  post.post.likes.users.includes(JSON.parse(localStorage.getItem('userInfo')).username), 
    isDisLiked: localStorage.getItem('userInfo') !== null && post.post.dislikes.users.includes(JSON.parse(localStorage.getItem('userInfo')).username)})
  const [opinionCount, setOpinionCount] = useState({likeCount: post.post.likes.count, 
    dislikeCount: post.post.dislikes.count})
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  
  const sendOpinion = async (opinion) => {
    try {
      await axios.post(`/thread/${post.post._id.thread_id}/likeDislike`,
      {
        pressedButton: opinion 
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
  const LikedThread = (async()=>{
    await sendOpinion('like')
    if (opinion.isLiked) {
      setOpinion({threadId: post.post._id.thread_id, isLiked: false, isDisLiked: false, userToken: localStorage.getItem('token')})
      setOpinionCount({likeCount: opinionCount.likeCount-1, dislikeCount: opinionCount.dislikeCount})
    }
    else{
      if(opinion.isDisLiked){
        setOpinionCount({likeCount: opinionCount.likeCount+1, dislikeCount: opinionCount.dislikeCount-1})
      }
      else{
        setOpinionCount({likeCount: opinionCount.likeCount+1, dislikeCount: opinionCount.dislikeCount})
      }
      setOpinion({threadId: post.post._id.thread_id, isLiked: true, isDisLiked: false, userToken: localStorage.getItem('token')})
      
      
    }
  })

  const DislikedThread = (()=>{
    sendOpinion('dislike')
    if (opinion.isDisLiked) {
      setOpinion({threadId: post.post._id.thread_id, isLiked: false, isDisLiked: false, userToken: localStorage.getItem('token')})
      setOpinionCount({likeCount: opinionCount.likeCount, dislikeCount: opinionCount.dislikeCount-1})
    }
    else{
      if(opinion.isLiked){
        setOpinionCount({likeCount: opinionCount.likeCount-1, dislikeCount: opinionCount.dislikeCount+1})
      }
      else{
        setOpinionCount({likeCount: opinionCount.likeCount, dislikeCount: opinionCount.dislikeCount+1})
      }
      setOpinion({threadId: post.post._id.thread_id, isLiked: false, isDisLiked: true, userToken: localStorage.getItem('token')})
      
    }
  })
  return (
    <Card className='text-center p-0' data-bs-theme='dark' xs={12} md={6}>
      
      <Card.Header className='primary d-flex justify-content-between'>
        {post.post.name}
        {post.isCreator ?
        <DropdownButton variant='outline-warning' drop='down-centered' title={<img className='filter-gold' src={import.meta.env.VITE_OPTIONS} alt='' />}>
        <Dropdown.Item
          className='list-group-item secondary text-center'
          onClick={() => navigate(`/editpost/${encodeURIComponent(post.post.name)}/${post.post._id.thread_id}`)} 
        >
        Edit
    </Dropdown.Item>
        </DropdownButton> : null} 
      </Card.Header>
      <Card.Body className='secondary h-auto overflow-auto' style={{ minHeight: '200px' , maxHeight: '400px'}}>
        <Card.Text>{post.post.content}</Card.Text>{' '}
        {post.post.image_array && post.post.image_array.length !== 0 ? <MyCarousel images={post.post.image_array? post.post.image_array : (post.post.image_array ? post.post.image_array : [])}></MyCarousel> : <img src={post.post.image_array[0]} alt={post.post.image_array[0]}></img>}
      </Card.Body>
      <Card.Footer>
        <Row>
          <Col xs={3}>
            <ToggleButton
              id={post.post._id && post.post._id.thread_id + 'like'}
              className='image-checkbox position-relative'
              type='checkbox'
              variant='secondary'
              checked={opinion.isLiked}
              value='1'
              onChange={() => LikedThread()}
              disabled={localStorage.getItem('token') === null}
            >
              <img
                src={import.meta.env.VITE_LIKE_BUTTON}
                alt='fist-bump'
                className={opinion.isLiked ? 'filter-gold' : 'filter-grey'}
              />
              <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary'>
                {opinionCount.likeCount}
              </span>{' '}
            </ToggleButton>

            </Col>
            <Col xs={3}>
              <ToggleButton
                id={post.post._id && post.post._id.thread_id + 'dislike'}
                className='image-checkbox position-relative'
                type='checkbox'
                variant='secondary'
                checked={opinion.isDisLiked}
                value='1'
                onChange={() => DislikedThread()}
                disabled={localStorage.getItem('token') === null}
              >
                <img
                  src={import.meta.env.VITE_DISLIKE_BUTTON}
                  alt='skull'
                  className={opinion.isDisLiked ? 'filter-red' : 'filter-grey'}
                />
                <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary'>
                  {opinionCount.dislikeCount}
                </span>
              </ToggleButton>
            </Col>
          {post.isDisabled ? null : <Col xs={6} className='text-end'>
            <Button
              className='comments-button tertiary position-relative h-100'
              onClick={()=>navigate(
                `/forums/${location.pathname.split('/')[2]}/${location.pathname.split('/')[3]}/${post.post._id.thread_id}/comments`)}
            >
              Comments
            </Button>
          </Col>}
        </Row>
      </Card.Footer>
      <Card.Footer className='text-muted'>
        Posted {DaysDifference(new Date(),post.post.creation_date)} days ago
      </Card.Footer>
      {showError ? <Card.Footer className='text-muted'><Row className='w-100 mx-auto justify-content-center text-center text-danger fw-bold' style={{backgroundColor: 'rgba(220,53,69, 0.5)'}}><p className='w-auto' autoFocus>ERROR:{errorMessage}</p></Row></Card.Footer> : null}
    </Card>
  )
}

export default PostCard
