import { Button, FormGroup, Row, Col, Image, Form, Tab, Tabs, DropdownButton, DropdownItem } from 'react-bootstrap'
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
  const [displayError, setDisplayError] = useState(false)

  const [oldPassword, setOldPassword] = useState('')

  const[password, setPassword] = useState('')
  const [validPassword, setValidPassword] = useState(false)

  const [matchPwd, setMatchPwd] = useState('')
  const [validMatch, setValidMatch] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const PWD_REGEX =
  /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/

  // TODO: check if data hasn't changed
  const SaveChanges = async () => {
    const username = document.getElementById('username').value.trim()
    const profilePicture = document.getElementById('fileUpload').value.trim()
    const description = document.getElementById('description').value.trim()
    const email = document.getElementById('email').value.trim()
    if (username !== '' && profilePicture !== '') {
      if(email !== ''){
        await axios.put(
          '/user',
          {
            username: username,
            profile_image: profilePicture,
            description: description,
            email: email
          },
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
          }
        )
      }
      else{
        await axios.put(
          '/user',
          {
            username: username,
            profile_image: profilePicture,
            description: description,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            withCredentials: true,
          }
        )
      }
      const prevUserInfo = localStorage.getItem('userInfo')
      localStorage.setItem('userInfo', JSON.stringify({profile_image: profilePicture, 
        custom_ui: prevUserInfo.custom_ui, roles: prevUserInfo.roles, username: username}))
      navigate(`/user/${username}`)
    } else {
      setDisplayError(true)
    }
  }
  const Cancel = async () => {
    if (confirm('Are you sure you want to cancel editing?')) {
      navigate(`/user/${location.pathname.split('/')[2]}`)
    }
  }
  const DeleteProfile = async() => {
    if (confirm('Are you sure you want to delete your account?')) {
      const password = prompt('Please enter your password to confirm deletion')
      if (password === null || !password.trim()) {
        return
      }
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
    }
  }
  const HandleSelect = (key) =>{
    if(key === 'preview'){
      setPreviewData({
        username: document.getElementById('username').value,
        profile_image: document.getElementById('fileUpload').value,
        description: document.getElementById('description').value
      })
    }
  }
  const ChangePassword = async () => {
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


  const AddTag = async () => {
    if(document.getElementById('tagUpload').value.trim() !== ''){
      await setTagList(prevItems=>[...prevItems,document.getElementById('tagUpload').value])
      document.getElementById('tagUpload').value = ''
    }
  }

  useEffect(() => {
    const result = PWD_REGEX.test(password)
    setValidPassword(result)
    const match = password === matchPwd
    setValidMatch(match)
  }, [password, matchPwd])
  useEffect(()=>{
    const GetPreviewData = async () => {
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
      document.getElementById('username').value = response.data.user.username
      document.getElementById('fileUpload').value = response.data.user.profile_image
      document.getElementById('description').value = response.data.user.description
    }
    GetPreviewData()
  },[location.pathname])

  return (
    <>
      <Navigation></Navigation>
      <Tabs
        defaultActiveKey='editUser'
        className='d-flex mx-auto text-nowrap mb-4 justify-content-center'
        style={{ width: '40vw', borderBottom: 'none' }}
        justify
        onSelect={HandleSelect}
      >
        <Tab eventKey='editUser' title='Edit' className='tab-size p-2 custom-border overflow-auto'>

          <FormGroup
            className='p-2 w-100 h-100 text-center'
            data-bs-theme='dark'
          >
            <Form.Label className='secondary'>Full Name</Form.Label>
            <Form.Control
              size='lg'
              type='text'
              placeholder='Stun Seed'
              className='mb-3 title text-center'
              id='fullName'
            />
          </FormGroup>
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
              {/* TODO: fill it with tags dynamically */}
                <DropdownButton
                  data-bs-theme='dark'
                  drop='down-centered'
                  title='Tags:'
                  className='dropdown-button w-25'
                >
                  {tagList.map((item,index) => (
                    <DropdownItem key={index} className='text-center' id={item}>
                      <Row className='justify-content-around'><Col className='my-auto'>{item}</Col> <Col><Button onMouseEnter={() => {document.getElementById(item).className = 'text-center dropdown-item bg-danger'}} onMouseLeave={() => {document.getElementById(item).className = 'text-center dropdown-item'}} style={{border: 'none'}} variant='outline-danger' className='p-0'><img className='filter-red hover-filter-black border border-2 border-danger rounded p-1' src='/src/assets/icons/trash.png' alt='trash' /></Button></Col></Row>
                    </DropdownItem>
                  ))}
                </DropdownButton>
                <Form.Control
                  className='w-50 mx-3'
                  placeholder='add tags here'
                  id='tagUpload'
                ></Form.Control>
                <Button
                  variant='outline-warning'
                  className='custom-button w-25'
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
            {displayError ? <div><span className='invalid'>Username or Profile picture field is empty!</span></div> : null}
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
            {/* TODO checks for password validity and error messages*/}
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
                ChangePassword()
              }
              className='mt-3'
            >
              Change password
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
          eventKey='deleteUser'
          title='Delete Profile'
          className='tab-size p-2 text-center'
        >
          <Button
            variant='outline-danger'
            size='lg'
            onClick={() => DeleteProfile()}
            className='mt-3'
          >
            Delete Profile
          </Button>
        </Tab>
        <Tab eventKey='preview' title='Preview' className='tab-size'>
          <Row className='justify-content-center'>
            <Image
              className='profileSize img-fluid'
              src={previewData.profile_image}
              roundedCircle
              style={{ float: 'center' }}
            ></Image>
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
