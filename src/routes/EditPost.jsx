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
  const [showError, setShowError] = useState(false)
  const [error, setError] = useState('')
  const [isCreator, setIsCreator] = useState(false)

  const SaveChanges = async () => {
    const name = document.getElementById('name').value.trim()
    const image_array = document.getElementById('fileUpload').value.trim()
    const content = document.getElementById('content').value.trim()
    if (name !== '' || content !== '') {
      try {
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
      } catch (error) {
        setError('Could not save changes!')
        setShowError(true)
      }
    } else {
      setError('Please fill both name and content field!')
      setShowError(true)
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
      try {
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
      } catch (error) {
        setError('Could not delete post')
        setShowError(true)
      }
    }

  }
  const AddImage = async () => {
    if(document.getElementById('fileUpload').value.trim() !== '' && !imageList.includes(document.getElementById('fileUpload').value)){
      await setImageList(prevItems=>[...prevItems,document.getElementById('fileUpload').value])
      document.getElementById('fileUpload').value = ''
    }
  }
  const removeImage = async (image) => {
    setImageList(prevItems => prevItems.filter(item => item !== image));
  }
  useEffect(()=>{
    const GetThreadData = async() => {
    try {
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
    setPreviewData(response.data)
    GetForum(response.data._id.forum_id)
    } catch (error) {
      setError('Could not get thread data')
      setShowError(true)
    }
    }
    const GetCreatorName = async (creatorId) =>{
      try {
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
      } catch (error) {
        setError('Could not get user information')
        setShowError(true)
      }
     } 
    const GetForum = async(forumId) =>{
      try {
        const response = await axios.get(`/forum/${forumId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      })
      setForum({forumName: response.data[0].forum_name, forumId: forumId})
      } catch (error) {
        setError('Could not get forum information')
        setShowError(true)
      }
    }
    GetThreadData()
  },[])
  return (
    <>
      <Navigation></Navigation>
      {showError ? <div className='text-center'><span className='invalid'>{error}</span></div> : null}
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
            <Form.Label className='secondary'>Image(s)</Form.Label>
            <div className='d-flex justify-content-around m-2 secondary'>
                <DropdownButton
                  data-bs-theme='dark'
                  drop='down-centered'
                  title='Image(s):'
                  className='dropdown-button'
                >
                  {/*TODO create function to remove image from list*/}
                  {imageList.map((item,index) => (
                    <DropdownItem key={index} className='text-center' id={item}>
                    <Row className='justify-content-around'><Col className='my-auto overflow-auto'>{item}</Col> <Col><Button onPointerDown={()=>removeImage(item)} onMouseEnter={() =>            
                     {document.getElementById(item).className = 'text-center dropdown-item bg-danger'}} onMouseLeave={() => 
                      {document.getElementById(item).className = 'text-center dropdown-item'}} style={{border: 'none'}} 
                      variant='outline-danger' className='p-0'><img className='filter-red hover-filter-black' src='/src/assets/icons/trash.png' alt='trash' /></Button></Col></Row>
                  </DropdownItem>
                  ))}
                </DropdownButton>
                <Form.Control
                  className='w-50'
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
            <PostCard image_array={imageList} post={previewData}></PostCard>
        </Tab>
      </Tabs>
    </>
  )
}

export default EditPost
