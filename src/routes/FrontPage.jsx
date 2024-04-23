import Navigation from '../components/Navigation'
import ForumCard from '../components/ForumCard'
import MessageList from '../components/chat-components/MessageList'
import { Col, Row, Container, Navbar, DropdownButton, Button, Form, FormGroup, Dropdown, Card, Table } from 'react-bootstrap'
import {  useState } from 'react'

function FrontPage(params) {

  const friendList = ['Friend 1', 'Friend 2', 'Friend 3', 'Friend 4']
  
  const messages = [
    {
      _id: {
        room_id: 1,
        creator_id: 1,
        message_id: 1
      },
      creator_name: 'Lajtaib',
      text: 'Hello!',
    },
    {
      _id: {
        room_id: 2,
        creator_id: 2,
        message_id: 2
      },
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
  const friends = friendList.map((friend) => (
    <Dropdown.Item
        className='list-group-item secondary text-center'
        key={friend}
        onPointerDown={() => AddToChat(friend.username)}>
        {friend.username}
    </Dropdown.Item>
))
const categoryList = dummyForum.tags.map((category,index) => (
  <th style={{ fontSize: 'small' }} key={index}>
    <i className='tertiary'>{category}</i>
  </th>
))

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
            <Col>

            <Card className='text-center p-0' data-bs-theme='dark'>
        <Card.Header className='primary'>{dummyForum.forum_name}</Card.Header>
        <Card.Body
          className='secondary'
          style={{
            backgroundImage: `url(${
              dummyForum.banner })`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {localStorage.getItem('userInfo') !== null ? !isSubscribed ?
          <Button 
            className='custom-button text-outline' disabled variant='outline-warning' style={{border: '1px solid gold'}} onPointerDown={()=>SubscribeToForum()}>Subscribe
          </Button>
           :
          <Button 
          className='custom-button text-outline' disabled variant='outline-warning' style={{border: '1px solid gold'}}  onPointerDown={()=>UnsubscribeFromForum()}>Unsubscribe
          </Button> 
          : 
          null}
          <Card.Title className='text-outline overflow-auto' style={{maxHeight: '50px'}}>
            {dummyForum.description}
          </Card.Title>
          <Button 
            onPointerDown={() => navigate(`/forums/${encodeURIComponent(dummyForum.forum_name)}/${dummyForum._id.forum_id}?page=1`)}
            className='custom-button text-outline'
            variant='outline-warning'
            disabled
          >
            Visit forum
          </Button>
          <Card.Text className='text-outline text-muted'>
            <i>Created at: {dummyForum.creation_date.toString().split('T')[0]}</i>
          </Card.Text>
        </Card.Body>
        <Card.Header className='p-0'>
          <Table responsive className='m-0'>
            <tbody>
              <tr>{categoryList}</tr>
            </tbody>
          </Table>
          </Card.Header>
        </Card>


            </Col>
          </Row>
          <div style={{borderTop: '3px solid #44454c'}}></div>
          <Row className='my-4 p-2'>
            <Col xs={7} ><div data-bs-theme='dark' className='p-0 h-100 w-100 border overflow-auto'>
      <Navbar className='justify-content-start pt-0' sticky='top' style={{zIndex: '1000'}}>
       
          <Col>
            <Row className='w-100 mx-auto' style={{backgroundColor: '#212529'}}>
              <Col className='text-start p-0'>
                <DropdownButton title={<img style={{width: '32px', height: '32px'}} src={import.meta.env.VITE_ADD_FRIEND_BUTTON} className='filter-gold'></img>} className='dropdown-button  m-0'>
                <div className='overflow-auto' style={{maxHeight: '200px'}}>{friends}</div>
                </DropdownButton>
              </Col>
              <Col className='text-end p-0'>
                <Button className='close-button ms-auto'>
                  <img className='hover-filter-red' src={import.meta.env.VITE_CANCEL} alt='' />
                </Button>
              </Col>
            </Row>
          </Col>
      </Navbar>
      <MessageList messages={messages}></MessageList>
      <Navbar sticky='bottom' style={{backgroundColor: '#343a40', zIndex: '1000'}}>
      <Container fluid className='justify-content-center w-100 p-0'>
        <Navbar.Toggle aria-controls='navbarScroll' />
          <Form className='w-100'>
          <FormGroup controlId='sendMsg'>
        <div className='row m-0'>
          <Form.Control
            placeholder='Send message'
            className='w-75'
            autoFocus
            disabled
          ></Form.Control>
          <Button
            variant='outline-warning'
            className='custom-button w-25 p-0 overflow-hidden'
            type='submit'
            disabled
            onPointerDown={() => SendMsg()}
          >
            Send
          </Button>
        </div>
      </FormGroup>
          </Form>
      </Container>
    </Navbar>
    </div></Col>
            <Col xs={5} className='text-end' style={{backgroundColor: '#4a4b4f'}}><h2>Chat with your friends in real time!</h2><p className='secondary'>You can access group chats and direct messages on the chats page, and by clicking on someones username on their profile.</p></Col>
          </Row>
          <div style={{borderTop: '3px solid #44454c'}}></div>
        </Col>
      </Container>
    </>
  )
}

export default FrontPage