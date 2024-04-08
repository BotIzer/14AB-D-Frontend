import { Button, FormGroup, Row, Col, DropdownButton, DropdownItem, Form, Tab, Tabs } from 'react-bootstrap'
import Navigation from '../components/Navigation'
import axios from '../api/axios'
import { useLocation, useNavigate, } from 'react-router-dom'
import { useEffect, useState } from 'react'
import PostCard from '../components/PostCard'
import ErrorPage from '../error-page'

function EditPost() {
  const navigate = useNavigate()
  const location = useLocation()

  const [imageList, setImageList] = useState([])
  const [previewData, setPreviewData] = useState({
    _id: '',
    name: '',
    image_array: [],
    content: '',
  })
  const [forum, setForum] = useState({forumName: '', forumId: ''})
  const [error, setError] = useState('')
  const [isCreator, setIsCreator] = useState(false)

  const preview = 
    {
      _id: {forum_id: 1,
         creator_id: 1,thread_id: 1},
      name: 'Peview Post 1',
      content: 'Content of Post 1',
      image_array: ['/src/assets/banner_test.jpg', '/src/assets/night-starry-sky-blue-shining-260nw-1585980592.png'],
      likes: {users: [], count: 0},
      dislikes: {users: [], count: 0},
      comment_count: 4,
      postDate: new Date(),
    }//TODO: Make previews dynamic

  const SaveChanges = async () => {
    const name = document.getElementById('name').value.trim()
    const image_array = document.getElementById('fileUpload').value.trim()
    const content = document.getElementById('content').value.trim()
    if (name !== '') {
      // TODO: Display error if nameis empty!
      await axios.put(
        `/thread/${previewData._id.thread_id}`,
        {
          name: name,
          content: content,
          image_array: image_array
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      )
      navigate(`/forums/${forum.forumName}/${forum.forumId}`)
    } else {
      return
    }
  }
  const Cancel = async () => {
    if (confirm('Are you sure you want to cancel editing?')) {
      navigate(`/forums/${forum.forumName}/${forum.forumId}`)
    }
  }
  const DeletePost = async() => {
    if (confirm('Are you sure you want to delete this post?')) {
      await axios.delete(
        `/thread/${previewData._id.thread_id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      )
      navigate(`/forums/${forum.forumName}/${forum.forumId}`)
    }

  }
  const AddImage = async () => {
    if(document.getElementById('fileUpload').value.trim() !== ''){
      await setImageList(prevItems=>[...prevItems,document.getElementById('fileUpload').value])
      document.getElementById('fileUpload').value = ''
    }
  }
  if (error != '') {
    return <ErrorPage errorStatus={error} />
  }

  useEffect(()=>{
    const GetThreadData = async() => {
    const response = await axios.get(`/thread/${location.pathname.split('/')[3]}`,
    { headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    withCredentials: true,
    })
    await GetCreatorName(response.data._id.creator_id)
    document.getElementById('name').value = response.data.name
    document.getElementById('content').value = response.data.content
    setImageList(response.data.image_array)
    setPreviewData({_id: response.data._id, name: response.data.name, image_array: response.data.image_array, content: response.data.content})
    GetForum(response.data._id.forum_id)
    }
    const GetCreatorName = async (creatorId) =>{
      const response = await axios.get(`/user/${JSON.parse(localStorage.getItem('userInfo')).username}`,
       {
         headers: {
           'Content-Type': 'application/json',
           authorization: `Bearer ${localStorage.getItem('token')}`,
         },
         withCredentials: true,
       })
       if (response.data.user._id !== creatorId) {
         setError({ response: { data: { message: 'You are not authorized to view this page!!' } } })
         return
       }
     } 
    const GetForum = async(forumId) =>{
      const response = await axios.get(`/forum/${forumId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      })
      setForum({forumName: response.data[0].forum_name, forumId: forumId})
    }
    GetThreadData()
  },[])
  return (
    <>
      <Navigation></Navigation>
      <Tabs
        defaultActiveKey='editPost'
        className='d-flex mb-5 mx-auto my-5 text-nowrap'
        style={{ width: '40vw', borderBottom: 'none' }}
        justify
      >
        <Tab eventKey='editPost' title='Edit' className='border tab-size p-2'>
          <FormGroup
            className='p-2 w-100 h-100 text-center'
            data-bs-theme='dark'
          >
            <Form.Label className='secondary'>name</Form.Label>
            <Form.Control
              type='text'
              placeholder='name'
              className='mb-3 name text-center'
              id='name'
            />
          </FormGroup>
          <FormGroup data-bs-theme='dark' className='text-center'>
            <Form.Label className='secondary'>Image(es)</Form.Label>
            <div className='d-flex justify-content-around m-2 secondary'>
                <DropdownButton
                  data-bs-theme='dark'
                  drop='down-centered'
                  title='image_array:'
                  className='dropdown-button'
                >
                  {imageList.map((item,index) => (
                    <DropdownItem key={index} className='text-center' id={item}>
                    <Row className='justify-content-around'><Col className='my-auto'>{item}</Col> <Col><Button onMouseEnter={() => {document.getElementById(item).className = 'text-center dropdown-item bg-danger'}} onMouseLeave={() => {document.getElementById(item).className = 'text-center dropdown-item'}} style={{border: 'none'}} variant='outline-danger' className='p-0'><img className='filter-red hover-filter-black' src='/src/assets/icons/trash.png' alt='trash' /></Button></Col></Row>
                  </DropdownItem>
                  ))}
                </DropdownButton>
                <Form.Control
                  className='w-auto'
                  placeholder='enter imgur links'
                  id='fileUpload'
                ></Form.Control>
                <Button
                  variant='outline-warning'
                  className='custom-button'
                  onClick={() => AddImage()}
                >
                  Add
                </Button>
              </div>
          </FormGroup>
          <FormGroup className='text-center' data-bs-theme='dark'>
            <Form.Label className='secondary'>Content</Form.Label>
            <Form.Control
              size='lg'
              className='text-center'
              as='textarea'
              placeholder='enter content'
              id='content'
            ></Form.Control>
          </FormGroup>
          <div
            className='d-flex justify-content-around my-3'
            style={{ borderTop: '1px solid white' }}
          >
            <Button
              variant='outline-warning'
              size='lg'
              onClick={() =>
                SaveChanges()
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
        <Tab
          eventKey='deletePost'
          title='Delete Post'
          className='tab-size p-2 text-center'
        >
          <Button
            variant='outline-danger'
            size='lg'
            onClick={() => DeletePost()}
            className='mt-3'
          >
            Delete Post
          </Button>
        </Tab>
        <Tab eventKey='preview' title='Preview' className='tab-size'>
            <PostCard post={preview}></PostCard>
        </Tab>
      </Tabs>
    </>
  )
}

export default EditPost
