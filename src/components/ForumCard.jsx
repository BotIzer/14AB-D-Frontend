import { Button, Card, Table, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import { useEffect, useState } from 'react'

function ForumCard(forum) {
  const navigate = useNavigate()
  const [isSubscribed, setIsSubscribed] = useState(forum.forum.isSubscribed)
  const [isBannerValid, setIsBannerValid] = useState(true)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const SubscribeToForum = async () =>{
    try {
      await axios.post('/forum/subscribeToForum',
    {
      forum_id: forum.forum._id.forum_id
    },
    {
      headers: {
        'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true
    })
    setIsSubscribed(true)
    } catch (error) {
      setShowError(true)
      setErrorMessage(error.response.message)
    }
  }
  const UnsubscribeFromForum = async () =>{
    try {
      await axios.post('/forum/leaveForum',
    {
      forum_id: forum.forum._id.forum_id
    },
    {
      headers: {
        'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true
    })
    setIsSubscribed(false)
    } catch (error) {
      setShowError(true)
      setErrorMessage(error.response.message)
    }
  }
  const categoryList = forum.forum.tags.map((category,index) => (
    <th style={{ fontSize: 'small' }} key={index}>
      <i className='tertiary'>{category}</i>
    </th>
  ))
  useEffect(()=>{
    const img = new Image();
    img.src = forum.forum.banner
    img.onerror = ()=>{
      setIsBannerValid(false)
    }
  },[forum.forum.banner])
  return (
    <>
      <Card className='text-center p-0' data-bs-theme='dark'>
        <Card.Header className='primary'>{forum.forum.forum_name}</Card.Header>
        <Card.Body
          className='secondary'
          style={{
            // TODO: ADD DEFAULT LINK
            backgroundImage: `url(${isBannerValid? 
              forum.forum.banner : 'https://cc-prod.scene7.com/is/image/CCProdAuthor/What-is-Stock-Photography_P1_mobile?$pjpeg$&jpegSize=200&wid=720'})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {localStorage.getItem('userInfo') !== null ? !isSubscribed ?
          <Button 
            className='custom-button text-outline' variant='outline-warning' style={{border: '1px solid gold'}} onClick={()=>SubscribeToForum()}>Subscribe
          </Button>
           :
          <Button 
          className='custom-button text-outline' variant='outline-warning' style={{border: '1px solid gold'}}  onClick={()=>UnsubscribeFromForum()}>Unsubscribe
          </Button> 
          : 
          null}
          {/* TODO: fix this */}
          <Card.Title className='text-outline overflow-auto' style={{maxHeight: "50px"}}>
            {/* {forum.forum.topPost.title} */}
            {forum.forum.description}
          </Card.Title>
          <Card.Text className='text-outline'>
            {/* <i>{forum.forum.topPost.content}</i> TODO ezek miért commentelve vannak?*/}
            <i>Fix this too</i>
          </Card.Text>
          <Button 
            onClick={() => navigate(`/forums/${encodeURIComponent(forum.forum.forum_name)}/${forum.forum._id.forum_id}?page=1`)}
            className='custom-button text-outline'
            variant='outline-warning'
          >
            Visit forum
          </Button>
        </Card.Body>
        <Card.Header className='p-0'>
          <Table responsive className='m-0'>
            <tbody>
              <tr>{categoryList}</tr>
            </tbody>
          </Table>
        </Card.Header>
        {showError ? <Card.Footer className='text-muted'><Row className='w-100 mx-auto justify-content-center text-center text-danger fw-bold' style={{backgroundColor: 'rgba(220,53,69, 0.5)'}}><p className='w-auto' autoFocus>ERROR:{errorMessage}</p></Row></Card.Footer> : null}
      </Card>
    </>
  )
}
export function DaysDifference(firstDate, secondDate) {
  const firstDateInMilliseconds = new Date(firstDate).getTime()
  const secondDateInMilliseconds = new Date(secondDate).getTime()
  return secondDateInMilliseconds - firstDateInMilliseconds < 0 
  ? Math.floor((secondDateInMilliseconds - firstDateInMilliseconds) / (1000 * 60 * 60 * 24))*-1 
  : Math.floor((secondDateInMilliseconds - firstDateInMilliseconds) / (1000 * 60 * 60 * 24))
}

export default ForumCard
