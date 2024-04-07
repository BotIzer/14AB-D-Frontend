import { Button, Card, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import { useEffect, useState } from 'react'

function ForumCard(forum) {
  const navigate = useNavigate()
  const [isSubscribed, setIsSubscribed] = useState(forum.forum.isSubscribed)
  const SubscribeToForum = async () =>{
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
  }
  const UnsubscribeFromForum = async () =>{
    await axios.post('/forum/unsubscribeFromForum',
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
  }
  const categoryList = forum.forum.tags.map((category,index) => (
    <th style={{ fontSize: 'small' }} key={index}>
      <i className='tertiary'>{category}</i>
    </th>
  ))
  
  const sinceUpdate = DaysDifference(forum.forum.lastUpdated, new Date())
  return (
    <>
      <Card className='text-center p-0' data-bs-theme='dark'>
        <Card.Header className='primary'>{forum.forum.forum_name}</Card.Header>
        <Card.Body
          className='secondary'
          style={{
            backgroundImage: `url(${forum.forum.banner})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {!isSubscribed ?<Button onClick={()=>SubscribeToForum()}>Subscribe</Button> :
          <Button onClick={()=>UnsubscribeFromForum()}>Unsubscribe</Button>}
          <Card.Title className='text-outline'>
            {/* {forum.forum.topPost.title} */}
            We need to fix this ASAP
          </Card.Title>
          <Card.Text className='text-outline'>
            {/* <i>{forum.forum.topPost.content}</i> TODO ezek miért commentelve vannak?*/}
            <i>Fix this too</i>
          </Card.Text>
          <Button 
            onClick={() => navigate(`/forums/${encodeURIComponent(forum.forum.forum_name)}/${forum.forum._id.forum_id}`)}
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
        <Card.Footer className='text-muted'>
          Last updated: <i>{sinceUpdate}</i> days ago
        </Card.Footer>
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
