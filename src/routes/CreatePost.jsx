import { Button, DropdownItem, FormGroup, Form, Tab, Tabs, DropdownButton } from 'react-bootstrap'
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
    //TODO - Add error when empty
    if (document.querySelector('.title').value.trim() !== '') {
      try {
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
    if (event.key === "Enter") {
      event.preventDefault();
      AddTag()
    }
  };

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
         // TODO: make it work if user is not in the user list, show error instead of navigate
         console.log(response.data[0])
      if(response.data[0].users.some(user=> user.user_id !== userResponse.data.user._id)){
        
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
            <Form.Label className='secondary'>Body</Form.Label>
            <TextEditor className='h-100'></TextEditor>
            {/* TODO: Style this */}
            {isSuccess? <p style={{fontSize: '40'}}>Congratulations! Your post was succesful!</p> :null}
            <div className='d-flex justify-content-around my-3'>
              <Button
                variant='outline-warning'
                size='lg'
                onClick={() => SendPost()}
              >
                Post
              </Button>
              <Button
                variant='outline-danger'
                size='lg'
                onClick={() => ClearAll()}
              >
                Clear all
              </Button>
            </div>
          </FormGroup>
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
                  <DropdownItem key={index}>
                    {item}
                  </DropdownItem>
                ))}
              </DropdownButton>
              <Form.Control
                className='w-100 mx-5'
                placeholder='paste Imgur link here'
                id='fileUpload'
                onKeyDown={(event)=>handleKeyDown(event)}
              ></Form.Control>
              <Button
                variant='outline-warning'
                className='custom-button'
                onClick={() => AddImage()}
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
                onClick={() => SendPost()}
                className='mt-3'
              >
                Post
              </Button>
              <Button
                variant='outline-danger'
                size='lg'
                onClick={() => ClearAll()}
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
