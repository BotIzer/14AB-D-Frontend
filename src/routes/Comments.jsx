import { useEffect, useState } from 'react'
import CommentAccordion from '../components/CommentAccordion'
import Navigation from '../components/Navigation'
import PostCard from '../components/PostCard'
import {Container, Row, Col} from 'react-bootstrap'
import axios from '../api/axios'

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

const commentList = dummyComments.map((comment) => (
  <Row key={comment._id.message_id} className='justify-content-center'>
    <CommentAccordion comment={comment} creator={dummyCreator}></CommentAccordion>
  </Row>
))
//TODO Get replace dummy Creator
useEffect(()=>{
  
  const GetThreadData = async() => {
    const response = await axios.get(`/thread/${location.pathname.split('/')[4]}`,
    { headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    withCredentials: true,
    })
    setThreadData({post: response.data})
  }
  GetThreadData()
},[])
return (
  <>
  <Navigation/>
   <Container fluid>
     <Col xs='auto'>
       <Row className='justify-content-center m-2 mb-4'>
         <PostCard post={(threadData !== undefined ? threadData : dummyPost)}></PostCard>
       </Row>
       {commentList}
     </Col>

   </Container>
  </>
)
}

export default Comments