import { Button, FormGroup, DropdownButton, Container, Row, Col, Table, Image, Form, Tab,  Tabs, OverlayTrigger, Tooltip, DropdownItem } from 'react-bootstrap'
import Navigation from '../components/Navigation'
import axios from '../api/axios'
import { useEffect, useState, } from 'react'
import PostCard from '../components/PostCard'
import { useNavigate } from 'react-router-dom'

function CreateForum() {

  const navigate = useNavigate()
  const [previewData, setPreviewData] = useState({
    title: '',
    tags: [],
    banner: '',
    description: '',
  })
  const [displayError, setDisplayError] = useState(false)
  const [tagError, setTagError] = useState(false)
  const [tooLongError, setTooLongError] = useState('')
  const [showTooLongError, setShowTooLongError] = useState(false)
  const postsPreview = [
    {
      _id: {forum_id: 1,
         creator_id: 1,thread_id: 1},
      name: 'Peview Post 1',
      content: 'Content of Post 1',
      image_array: [],
      likes: {count: 2, users: ['lorem', 'angryjoe']},
      dislikes: {count: 0, users: []},
      comment_count: 4,
      postDate: new Date(),
    },
    {
      _id: {forum_id: 2,
        creator_id: 2,thread_id: 2},
      name: 'Peview Post 2',
      content: 'Content of Post 2',
      image_array: [],
      likes: {count: 0, users: []},
      dislikes: {count: 2, users: ['ipsum', 'angryjoe']},
      comment_count: 4,
      postDate: new Date(),
    },
  ]
  const postList = postsPreview.map((thread) => (
    <Row key={thread._id} className='w-100'>
      <PostCard post={thread}></PostCard>
    </Row>
  ))

  const CreateForum = async () => {
    const title = document.getElementById('title').value.trim()
    const banner = document.getElementById('banner').value.trim()
    const description = document.getElementById('description').value.trim()
    let error = ''
    if(description.length > 5000){
      setShowTooLongError(true)
      error += 'The description can only be 5000 characters long!\n'
    }
    if(title.length > 40){
      setShowTooLongError(true)
      error += 'The title can only be 40 characters long!'
    }
    if(error != ''){
      return
    }
    if (title !== '' && banner !== '') {
      try {
        const response = await axios.post(
          '/forum',
          {
            forum_name: title,
            banner: banner,
            tags: previewData.tags,
            description: description
          },
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
          }
        )
      } catch (error) {
      setDisplayError(true)
      }
      navigate(`/forums/${title}/${response.data.forumId}`)
    }
    else{
      setDisplayError(true)
    }
  }
  const Cancel = async () => {
    if (confirm('Are you sure you want to cancel forum creation?')) {
      navigate('/forums')
    }
  }
  const HandleSelect = async (eventKey) => {
    if(eventKey === 'preview') {
      const title = document.getElementById('title').value.trim()
      const banner = document.getElementById('banner').value.trim()
      const description = document.getElementById('description').value.trim()
  
      setPreviewData({
        title: title,
        tags: previewData.tags,
        banner: banner,
        description: description
      })
    }
  }
  const AddTag = () => {
    if(document.getElementById('tagUpload').value.trim() === ''){
      document.getElementById('tagUpload').value = ''
      return
    }
    if(document.getElementById('tagUpload').value.length > 15){
      setTagError(true)
      return
    }
    setPreviewData(prevState => ({
      ...prevState,
      tags: [...prevState.tags, document.getElementById('tagUpload').value]
    }))
    document.getElementById('tagUpload').value = ''
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      AddTag()
    }
  }

  useEffect(()=>{
    if(localStorage.getItem('token') === null){
      navigate('/')
    }
  },[])
  useEffect(()=>{
    const timer = setTimeout(() => {
      setTagError(false)
      setDisplayError(false)
    }, 500)
  
    return () => clearTimeout(timer)
  },[tagError, displayError])
  return (
    <>
      <Navigation></Navigation>
      <Tabs
        defaultActiveKey='forum'
        className='d-flex mb-5 mx-auto my-5 text-nowrap'
        style={{ width: '40vw', borderBottom: 'none' }}
        justify
        onSelect={HandleSelect}
      >
        <Tab eventKey='forum' title='Create forum' className='border tab-size p-2'>
        <FormGroup
            className='p-2 w-100 h-100 text-center'
            data-bs-theme='dark'
          >
            <Form.Label className='secondary'>Title</Form.Label>
            <Form.Control
              size='lg'
              type='text'
              placeholder='title'
              className='mb-3 title text-center'
              id='title'
            />
          </FormGroup>
          <FormGroup data-bs-theme='dark'>
            <div className='d-flex justify-content-around m-2 secondary'>
                <DropdownButton
                  data-bs-theme='dark'
                  drop='down-centered'
                  title='Tags:'
                  className='dropdown-button'
                >
                  {previewData.tags.map((item,index) => (
                    <DropdownItem key={index} className='text-center' id={item}>
                      <Row className='justify-content-around'><Col className='my-auto overflow-auto'>{item}</Col> <Col><Button onClick={()=>removeTag(item)} onMouseEnter={() =>            
                       {document.getElementById(item).className = 'text-center dropdown-item bg-danger'}} onMouseLeave={() => 
                        {document.getElementById(item).className = 'text-center dropdown-item'}} style={{border: 'none'}} 
                        variant='outline-danger' className='p-0'><img className='filter-red hover-filter-black' src={import.meta.env.VITE_TRASH} alt='trash' /></Button></Col></Row>
                    </DropdownItem>
                  ))}
                </DropdownButton>
                <Form.Control
                  className='w-auto'
                  placeholder='add tags here'
                  id='tagUpload'
                  onKeyDown={(event)=>handleKeyDown(event)}
                ></Form.Control>
                <Button
                  variant='outline-warning'
                  className='custom-button'
                  onClick={() => AddTag()}
                >
                  Add
                </Button>
              </div>
          </FormGroup>

          <FormGroup
            className='p-2 w-100 h-100 text-center'
            data-bs-theme='dark'
          >
            {tagError ? <div><span className='invalid'>Tags cannot be longer than 15 characters!</span></div> : null}
            <Form.Label className='secondary'>Banner</Form.Label>
            <Form.Control
              className='text-center mb-3'
              data-bs-theme='dark'
              placeholder='paste banner link here'
              defaultValue={'default'}
              id='banner'
            ></Form.Control>
            <OverlayTrigger placement='right' overlay={<Tooltip>Note: banners with an aspect ratio of 6:1 work best, other pictures may appear stretched or shrunk</Tooltip>}>
              <Image className='hover-filter-gold' src={import.meta.env.VITE_INFO}></Image>
            </OverlayTrigger>
          </FormGroup>
          <FormGroup className='text-center' data-bs-theme='dark'>
            <Form.Label className='secondary'>Description</Form.Label>
            <Form.Control
              className='text-center'
              as='textarea'
              placeholder='enter description'
              id='description'
            ></Form.Control>
            {displayError ? <div><span className='invalid'>Title or Banner field is empty!</span></div> : null}
            {showTooLongError ?  <div><span className='invalid'>{tooLongError}</span></div> : null}
          </FormGroup>
          <div
            className='d-flex justify-content-around my-3'
            style={{ borderTop: '1px solid white' }}
          >
            <Button
              variant='outline-warning'
              size='lg'
              onClick={() =>
                CreateForum()
              }
              className='mt-3'
            >
              Save
            </Button>
            <Button
              variant='outline-danger'
              size='lg'
              onClick={() => Cancel()}
              className='mt-3'
            >
              Cancel
            </Button>
          </div>
        </Tab>
        <Tab eventKey='preview' title='Preview' className='tab-size'>
        <Container fluid>
        <Row
          className='p-2'
          style={{
            backgroundImage: `url(${previewData.banner})`,
            backgroundSize: 'cover',
            height: '20vh',
          }}
        >
          <h1 className='text-outline text-center m-auto'>
            {previewData.title}
          </h1>
        </Row>
        <Row className='no-padding-table'>
          <Table responsive className='m-0' data-bs-theme='dark'>
            <tbody>
              <tr>
                {previewData.tags.map((tag, index) => (
                <th
                style={{ fontSize: 'small', borderWidth: '2px' }}
                key={index}
                className='text-center'
              >
                <i className='tertiary'>{tag}</i>
              </th>
                  ))}
              </tr>
            </tbody>
          </Table>
        </Row>
        <Row className='secondary'>
          <div className='text-center p-5 custom-border'>
            <i>{previewData.description}</i>
          </div>
        </Row>
        <Col xs={12} md={{ span: 6, offset: 3 }}>
          {postList}
        </Col>
      </Container>
          </Tab>
      </Tabs>
    </>
  )
}

export default CreateForum
