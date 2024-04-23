import { Button, DropdownItem, FormGroup, Form, Tab, Tabs, DropdownButton, Row, Col } from 'react-bootstrap'
import TextEditor from '../components/TextEditor'
import Navigation from '../components/Navigation'
import axios from '../api/axios'
import { useEffect, useState } from 'react'
import { useLocation} from 'react-router-dom'

function CreatePost() {
  const location = useLocation()

  const [imgList, setImgList] = useState([])
  const [isSuccess, setIsSuccess] = useState(false)
  const forumName = location.pathname.split('/')[2]
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const SendPost = async () => {
    if (document.querySelector('.title').value.trim() !== '') {
      try {
        if (document.querySelector('.title').value == '' || document.querySelector('.ql-editor').innerText == '') {
          setErrorMessage('Please fill both title and content fields!')
          setShowError(true)
          return
        }
        await axios.post(
          '/thread',
          {
            forum_name: decodeURIComponent(forumName),
            name: document.querySelector('.title').value,
            content: document.querySelector('.ql-editor').innerText,
            images: imgList
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
        setErrorMessage('Could not send post')
        setShowError(true)
      }
    }else{
      setErrorMessage('Cant post empty thread!')
      setShowError(true)
    }
    const editor = document.querySelector('.ql-editor')
    editor.innerHTML = ''
    const titles = document.querySelectorAll('.title')
    titles.forEach((title) => (title.value = ''))
    document.getElementById('fileUpload').value = ''
    setImgList([])
    setIsSuccess(true)
  }
  const ClearAll = async () => {
    if (confirm('Are you sure you want to clear all fields?')) {
      const editor = document.querySelector('.ql-editor')
      editor.innerHTML = ''
      const titles = document.querySelectorAll('.title')
      titles.forEach((title) => (title.value = ''))
      document.getElementById('fileUpload').value = ''
      setImgList([])
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      AddTag()
    }
  }

  const AddImage = async () => {
    await setImgList(prevItems=>[...prevItems,document.getElementById('fileUpload').value])
    document.getElementById('fileUpload').value = ''
  }
  useEffect(()=>{
    const GetForumData = async () =>{
      try {
        const response = await axios.get(`/forum/${location.pathname.split('/')[3]}`,{
          headers: {
            'Content-Type': 'application/json',
            authorization: `${localStorage.getItem('token') !== null ? 
            `Bearer ${localStorage.getItem('token')}` : 'Bearer null'}`
          },
          withCredentials: true,
        })
        const userResponse = await axios.get(`/user/${JSON.parse(localStorage.getItem('userInfo')).username}`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `${localStorage.getItem('token') !== null ? 
            `Bearer ${localStorage.getItem('token')}` : 'Bearer null'}`
          },
        })
      if(response.data[0].users.some(user=> user.user_id !== userResponse.data.user._id)){
        setErrorMessage('User is not subscribed to thread!')
        setShowError(true)
      }
      } catch (error) {
        setErrorMessage('Could not get forum data')
        setShowError(true)
      }
    }
      GetForumData()
  },[])
  return (
    <>
      <Navigation></Navigation>
      {showError ? <Row className='w-100 mx-auto justify-content-center text-center text-danger fw-bold' style={{backgroundColor: 'rgba(220,53,69, 0.5)'}}><p className='w-auto' autoFocus>ERROR:{errorMessage}</p></Row> : null}
      <Tabs
        defaultActiveKey='post'
        className='d-flex mb-5 mx-auto my-5 text-nowrap'
        style={{ width: '40vw', borderBottom: 'none' }}
        justify
      >
        <Tab eventKey='post' title='Post' className='border tab-size p-2'>
          <FormGroup className='p-2 w-100 h-100' data-bs-theme='dark'>
            <Form.Label className='secondary'>Title</Form.Label>
            <Form.Control
              size='lg'
              type='text'
              placeholder='Title'
              className='mb-3 title'
            />
            <Form.Label className='secondary'>Content</Form.Label>
            <TextEditor className='h-100'></TextEditor>
            <div className='d-flex justify-content-around my-3'>
              <Button
                variant='outline-warning'
                size='lg'
                onPointerDown={() => SendPost()}
              >
                Post
              </Button>
              <Button
                variant='outline-danger'
                size='lg'
                onPointerDown={() => ClearAll()}
              >
                Clear all
              </Button>
            </div>
          </FormGroup>
          {isSuccess? <b><p className='text-success text-center' style={{fontSize: 'medium', backgroundColor: 'rgba(25,135,84, 0.2)'}}>Congratulations! Your post was succesful!</p></b> :null}
        </Tab>
        <Tab
          eventKey='media'
          title='Media File'
          className='border p-2 tab-size'
          data-bs-theme='dark'
        >
          <FormGroup className='p-2 w-100 h-100'>
            <div className='d-flex justify-content-around m-2 secondary'>
              <DropdownButton
                data-bs-theme='dark'
                drop='down-centered'
                title='Added Links:'
                className='dropdown-button'
              >
                {imgList.map((item,index) => (
                  <DropdownItem key={index} className='text-center' id={item}>
                  <Row className='justify-content-around'><Col className='my-auto overflow-auto'>{item}</Col> <Col><Button onPointerDown={()=>removeTag(item)} onMouseEnter={() =>            
                   {document.getElementById(item).className = 'text-center dropdown-item bg-danger'}} onMouseLeave={() => 
                    {document.getElementById(item).className = 'text-center dropdown-item'}} style={{border: 'none'}} 
                    variant='outline-danger' className='p-0'><img className='filter-red hover-filter-black' src={import.meta.env.VITE_TRASH} alt='trash' /></Button></Col></Row>
                </DropdownItem>
                ))}
              </DropdownButton>
              <Form.Control
                className='mx-2 text-center'
                placeholder='paste link'
                id='fileUpload'
                onKeyDown={(event)=>handleKeyDown(event)}
              ></Form.Control>
              <Button
                variant='outline-warning'
                className='custom-button'
                onPointerDown={() => AddImage()}
              >
                Add
              </Button>
            </div>
            <div
              className='d-flex justify-content-around my-3'
              style={{ borderTop: '1px solid white' }}
            >
              <Button
                variant='outline-warning'
                size='lg'
                onPointerDown={() => SendPost()}
                className='mt-3'
              >
                Post
              </Button>
              <Button
                variant='outline-danger'
                size='lg'
                onPointerDown={() => ClearAll()}
                className='mt-3'
              >
                Clear all
              </Button>
            </div>
          </FormGroup>
        </Tab>
      </Tabs>
    </>
  )
}

export default CreatePost
