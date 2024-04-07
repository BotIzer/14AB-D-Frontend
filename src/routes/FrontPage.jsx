import Navigation from '../components/Navigation'
import ForumCard from '../components/ForumCard'
import ChatWindow from '../components/ChatWindow'
import { Col, Row, Container } from 'react-bootstrap'
import {  useState } from 'react'

function FrontPage(params) {

  const [showChat, setShowChat] = useState(false)
  const chatId = 1
  const messages = [
    {
      _id: 1,
      creator_name: 'Lajtaib',
      text: 'Hello!',
    },
    {
      _id: 2,
      creator_name: 'Markneu22',
      text: 'Hi!',
    }
  ]
  const dummyForum = {
    _id: {
      creator_id: 1,
      forum_id: 1
    },
    description: 'Wow, very cool!',
    forum_name: 'Look at this forum!',
    creation_date: Date.now(),
    banner: '/src/assets/banner_test.jpg',
    blacklist: [],
    users: [],
    rating: 9,
    tags: ['gaming', 'e-sports'],
    topThread: {
      _id: {
        forum_id: 1,
        creator_id: 1,
        thread_id: 1
      },
      name: 'Top Thread',
      likes: {
        coutn: 10,
        users: [],
      },
      dislikes: {
        coutn: 1,
        users: [],
      },
      editors: ['Markneu22'],
      emoticons: [],
      creation_date: Date.now(),
      content: 'This is the top rated post!',
      image_array: ['/src/assets/night-starry-sky-blue-shining-260nw-1585980592.png'],
    }
  }

  const CloseChat = () => {
    setShowChat(false)
  }

  return (
    <>
      <Navigation></Navigation>
      <Container>
        <Col className='overflow-hidden'>
          <Row className='text-center my-4'>
            <h1>BlitzForFriends</h1>
            <p className='secondary'>Feeling lonely? Or simply just want to meet new people? You've come to the right place!</p>
          </Row>
          <p className='secondary'>We've got:</p>
          <div style={{borderTop: '3px solid #44454c'}}></div>
          <Row className='my-4 p-2' style={{backgroundColor: '#4a4b4f'}}>
            <Col className='text-start'><h2>Forums!</h2><p className='secondary'>Share your experiences with others that are interested in the same themes via tags!</p></Col>
            <Col><ForumCard forum={dummyForum}></ForumCard></Col>
          </Row>
          <div style={{borderTop: '3px solid #44454c'}}></div>
          <Row className='my-4 p-2'>
            <Col><ChatWindow close={CloseChat} type='friend' selectedChat={chatId} chatData={messages}></ChatWindow></Col>
            <Col className='text-end' style={{backgroundColor: '#4a4b4f'}}><h2>Chat with your friends in real time!</h2><p className='secondary'>You can access group chats and direct messages on the chats page, and by clicking on someones username on their profile.</p></Col>
          </Row>
          <div style={{borderTop: '3px solid #44454c'}}></div>
        </Col>
      </Container>
    </>
  )
}

export default FrontPage