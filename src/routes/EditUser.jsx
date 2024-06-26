import { Button, FormGroup, Row, Col, Image as ReactImage, Form, Tab, Tabs, DropdownButton, DropdownItem, Table } from 'react-bootstrap'
import Navigation from '../components/Navigation'
import axios from '../api/axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function EditUser() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [tagList, setTagList] = useState([])
  const [previewData, setPreviewData] = useState({
    username: '',
    profile_image: '',
    description: '',
  })
  const PWD_REGEX =
  /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/
  const [showError, setShowError] = useState(false)

  const [oldPassword, setOldPassword] = useState('')

  const[password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)

  const [matchPwd, setMatchPwd] = useState('')
  const [validMatch, setValidMatch] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isBannerValid, setIsBannerValid] = useState(true)
  useEffect(() => {
    const result = PWD_REGEX.test(password)
    setValidPassword(result)
    const match = password === matchPwd
    setValidMatch(match)
  }, [password, matchPwd])
  useEffect(()=>{
    const getPreviewData = async () => {
      try {
        const response = await axios.get(`/user/${location.pathname.split('/')[2]}`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        })
        setPreviewData({
          username: response.data.user.username,
          profile_image: response.data.user.profile_image,
          description: response.data.user.description,
        })
        setTagList(response.data.user.hobbies)
        document.getElementById('username').value = response.data.user.username
        document.getElementById('fileUpload').value = response.data.user.profile_image
        document.getElementById('description').value = response.data.user.description
      } catch (error) {
        setError('Could not get user information')
        setShowError(true)
      }
    }
    getPreviewData()
  },[location.pathname])
  const SaveChanges = async () => {
    const username = document.getElementById('username').value.trim()
    const profilePicture = document.getElementById('fileUpload').value.trim()
    const description = document.getElementById('description').value.trim()
    const email = document.getElementById('email').value.trim()
    if (username !== '' && profilePicture !== '') {
      if(email !== ''){
        try {
          await axios.put(
            '/user',
            {
              username: username,
              profile_image: profilePicture,
              description: description,
              hobbies: tagList,
              email: email,
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
          setError('Could not update user information')
        }
      }
      else{
        try {
          await axios.put(
            '/user',
            {
              username: username,
              profile_image: profilePicture,
              description: description,
              hobbies: tagList
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
          setError('Could not update user information')
          setShowError(true)
        }
      }
      const prevUserInfo = localStorage.getItem('userInfo')
      localStorage.setItem('userInfo', JSON.stringify({profile_image: profilePicture, 
        custom_ui: prevUserInfo.custom_ui, roles: prevUserInfo.roles, username: username}))
      navigate(`/user/${username}`)
    } else {
      setShowError(true)
    }
  }
  const cancel = async () => {
    if (confirm('Are you sure you want to cancel editing?')) {
      navigate(`/user/${location.pathname.split('/')[2]}`)
    }
  }
  const deleteProfile = async() => {
    if (confirm('Are you sure you want to delete your account?')) {
      const password = prompt('Please enter your password to confirm deletion')
      if (password === null || !password.trim()) {
        return
      }
      try {
        await axios.delete(
          '/user',
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.getItem('token')}`,
              password: password
            },
            withCredentials: true,
          }
        )
        localStorage.clear()
        dispatchEvent(new Event('storage'))
        navigate('/')
      } catch (error) {
        setError('Could not delete user')
        setShowError(true)
      }
    }
  }
  const handleSelect = (key) =>{
    if(key === 'preview'){
      setPreviewData({
        username: document.getElementById('username').value,
        profile_image: document.getElementById('fileUpload').value,
        description: document.getElementById('description').value
      })
    }
  }
  const changePassword = async () => {
    if(oldPassword.trim() == '' || password.trim() == '' || matchPwd.trim() == ''){
      setError('Complete all fields before sending data!')
      return
    }
    try {
      const response = await axios.post('/user/changePassword',
      {
        old_passwd: document.getElementById('currentPass').value,
        new_passwd: document.getElementById('newPass').value,
        new_passwd2: document.getElementById('confirmPass').value
      },
      {
        headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true,
    })
    setSuccess('Success! ' + response.data.message)
    } catch (error) {
      setError(error.response.data.message)
    }
   
  }


  const addTag = async () => {
    if(document.getElementById('tagUpload').value.trim() !== '' && !tagList.includes(document.getElementById('tagUpload').value.trim())){
      await setTagList(prevItems=>[...prevItems,document.getElementById('tagUpload').value])
      document.getElementById('tagUpload').value = ''
    }
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addTag()
    }
  }
  const removeTag = (tag) =>{
    setTagList(prevTags => prevTags.filter(item => item !== tag))
  }
  const hobbyList = tagList.map((hobby,index) => (
    <th style={{ fontSize: 'small' }} key={index}>
      <i className='tertiary'>{hobby}</i>
    </th>
  ))
  useEffect(() => {
    const img = new Image()
    img.src = previewData.profile_image
    img.onload = ()=>{
      setIsBannerValid(true)
    }
    img.onerror = () => {
      setIsBannerValid(false)
    }
  }, [previewData.profile_image,handleSelect])
  return (
    <>
      <Navigation></Navigation>
      {showError ? <div className='text-center'><span className='invalid'>{error}</span></div> : null}
      <Tabs
        defaultActiveKey='editUser'
        className='d-flex mx-auto text-nowrap mb-4 justify-content-center'
        style={{ width: '40vw', borderBottom: 'none' }}
        justify
        onSelect={handleSelect}
      >
        <Tab eventKey='editUser' title='Edit' className='tab-size p-2 custom-border overflow-auto'>

          <FormGroup
            className='p-2 w-100 h-100 text-center'
            data-bs-theme='dark'
          >
            <Form.Label className='secondary'>Username</Form.Label>
            <Form.Control
              type='text'
              placeholder='username'
              className='mb-3 title text-center'
              id='username'
            />
          </FormGroup>
          <FormGroup
            className='p-2 w-100 h-100 text-center'
            data-bs-theme='dark'
          >
            <Form.Label className='secondary'>E-mail</Form.Label>
            <Form.Control
              type='text'
              placeholder='example@placeholder.com'
              className='mb-3 title text-center'
              id='email'
            />
          </FormGroup>


        
          <FormGroup data-bs-theme='dark' className='w-100'>
            <div className='d-flex justify-content-around m-2 secondary'>
                <DropdownButton
                  data-bs-theme='dark'
                  drop='down-centered'
                  title='Tags:'
                  className='dropdown-button w-25'
                >
                  {tagList.map((item,index) => (
                    <DropdownItem key={index} className='text-center' id={item}>
                      <Row className='justify-content-around'><Col className='my-auto'>{item}</Col> <Col><Button onClick={()=>removeTag(item)} 
                      onMouseEnter={() => {document.getElementById(item).className = 'text-center dropdown-item bg-danger'}} 
                      onMouseLeave={() => {document.getElementById(item).className = 'text-center dropdown-item'}} style={{border: 'none'}} 
                      variant='outline-danger' className='p-0'>
                      <img className='filter-red hover-filter-black border border-2 border-danger rounded p-1' src={import.meta.env.VITE_TRASH} alt='trash' /></Button></Col></Row>
                    </DropdownItem>
                  ))}
                </DropdownButton>
                <Form.Control
                  className='w-50 mx-3'
                  placeholder='add tags here'
                  id='tagUpload'
                  onKeyDown={(event)=>handleKeyDown(event)}
                ></Form.Control>
                <Button
                  variant='outline-warning'
                  className='custom-button w-25'
                  onClick={() => addTag()}
                >
                  Add
                </Button>
              </div>
          </FormGroup>


          <FormGroup
            className='p-2 w-100 h-100 text-center'
            data-bs-theme='dark'
          >
            <Form.Label className='secondary'>Profile picture</Form.Label>
            <Form.Control
              className='text-center mb-3'
              data-bs-theme='dark'
              placeholder='paste pfp link here'
              id='fileUpload'
            ></Form.Control>
          </FormGroup>
          <FormGroup className='text-center' data-bs-theme='dark'>
            <Form.Label className='secondary'>Description</Form.Label>
            <Form.Control
              className='text-center'
              as='textarea'
              placeholder='enter description'
              id='description'
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
              onClick={() => cancel()}
              className='mt-3'
            >
              Cancel
            </Button>
          </div>
        </Tab>

        <Tab eventKey='editPass' title='Change Password' className='custom-border tab-size p-2'>
          <FormGroup
            className='p-2 w-100 h-100 text-center'
            data-bs-theme='dark'
          >
            <Form.Label className='secondary'>Enter current password</Form.Label>
            <Form.Control
              
              size='lg'
              type='password'
              placeholder='current password'
              className='mb-3 title text-center'
              id='currentPass'
              onChange={(e)=>setOldPassword(e.target.value)}
            />
          </FormGroup>
          <FormGroup
            className='p-2 w-100 h-100 text-center'
            data-bs-theme='dark'
          >
            <Form.Label className='secondary'>New Password</Form.Label>
            <Form.Control
              size='lg'
              type='password'
              placeholder='enter new password'
              className='mb-3 title text-center'
              id='newPass'
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className={password == oldPassword && password && oldPassword ? 'invalid' : 'offcanvas'}>New password cannot be the same as the old password!</p>
            <p
                  id='pwdnote'
                  className={password && !validPassword ? 'invalid' : 'offcanvas'}
                >
                  8 to 24 characters. <br />
                  Must include uppercase and lowercase letters, a number, and
                  a special character. <br />
                  Allowed characters:{' '}
                  <span aria-label='exclamation mark'>!</span>
                  <span aria-label='at symbol'>@</span>{' '}
                  <span aria-label='hashtag'>#</span>
                  <span aria-label='dollar sign'>$</span>{' '}
                  <span aria-label='percent'>%</span>
                </p>
          </FormGroup>
          <FormGroup
            className='p-2 w-100 h-100 text-center'
            data-bs-theme='dark'
          >
            <Form.Label className='secondary'>Confirm new Password</Form.Label>
            <Form.Control
              size='lg'
              type='password'
              placeholder='re-enter new password'
              className='mb-3 title text-center'
              id='confirmPass'
              onChange={(e) => setMatchPwd(e.target.value)}
            />
            <p
                    id='confirmnote'
                    className={!validMatch ? 'invalid' : 'offcanvas'}
                  >
                    Must match the first password input field.
                  </p>
            {error !== '' && <b style={{fontSize: '40px'}} className='invalid'>{error}</b>}
            {success != '' && <b style={{fontSize: '40px'}} className='valid'>{success}</b>}
          </FormGroup>
          <div
            className='d-flex justify-content-around my-3'
            style={{ borderTop: '1px solid white' }}
          >
            <Button
              variant='outline-warning'
              size='lg'
              onClick={() =>
                changePassword()
              }
              className='mt-3'
            >
              Change password
            </Button>
            <Button
              variant='outline-danger'
              size='lg'
              onClick={() => cancel()}
              className='mt-3'
            >
              Cancel
            </Button>
          </div>
        </Tab>
        <Tab
          eventKey='deleteUser'
          title='Delete Profile'
          className='tab-size p-2 text-center'
        >
          <Button
            variant='outline-danger'
            size='lg'
            onClick={() => deleteProfile()}
            className='mt-3'
          >
            Delete Profile
          </Button>
        </Tab>
        <Tab eventKey='preview' title='Preview' className='tab-size'>
          <Row className='justify-content-center'>
            <ReactImage
              className='profileSize img-fluid'
              src={isBannerValid ? previewData.profile_image : import.meta.env.VITE_BFF_DEFAULT}
              roundedCircle
              style={{ float: 'center' }}
            ></ReactImage>
          </Row>
          <Row className='justify-content-center'>
              <Table responsive className='m-0' data-bs-theme='dark'>
              <tbody>
                <tr className='text-center'>{hobbyList}</tr>
              </tbody>
              </Table>
            </Row>
          <Row className='text-center'>
            <h4>{previewData.username}</h4>
          </Row>
          <Row className='justify-content-center text-center'>
            <p className='text-justify secondary'>{previewData.description}</p>
          </Row>
        </Tab>
      </Tabs>
    </>
  )
}

export default EditUser