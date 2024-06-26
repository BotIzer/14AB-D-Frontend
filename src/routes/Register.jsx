import Navigation from '../components/Navigation'
import { Container, Row, Col, Form } from 'react-bootstrap'
import axios from '../api/axios'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'



function Register() {
  const navigate = useNavigate()
  const userRef = useRef()
  const errRef = useRef()

  const [user, setUser] = useState('')
  const [validName, setValidName] = useState(false)

  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)

  const [pwd, setPwd] = useState('')
  const [validPwd, setValidPwd] = useState(false)

  const [matchPwd, setMatchPwd] = useState('')
  const [validMatch, setValidMatch] = useState(true)

  const [errMsg, setErrMsg] = useState('')
  const [success, setSuccess] = useState(false)
  const [succMessage, setSuccMessage] = useState('')

  const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,20}$/
  const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
  const PWD_REGEX =
  /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v1 = USER_REGEX.test(user)
    const v2 = PWD_REGEX.test(pwd)
    if (!v1 || !v2) {
      setErrMsg('Invalid Entry')
      return
    }
    try {
      await axios.post(
        '/register',
        {
          email: email.toLowerCase(),
          password: pwd,
          username: user,
        },
        {
          headers: { 'Content-Type': 'application/json', authorization: 'Bearer null' },
          withCredentials: false,
        }
      )
      setSuccMessage('User created! Verify your email to log in!')
      setSuccess(true)
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response')
      } else if (err.response?.status === 409) {
        setErrMsg(`${err.response.data.message}`)
      } else if (err.response?.status === 403) {
        setErrMsg('Already logged in!')
      } else {
        setErrMsg('Registration failed')
      }
      errRef.current.focus()
    }
  }

  useEffect(() => {
    userRef.current.focus()
  }, [])

  useEffect(() => {
    const result = USER_REGEX.test(user)
    setValidName(result)
  }, [user])

  useEffect(() => {
    const result = USER_REGEX.test(user)
    setValidName(result)
    const resultEmail = EMAIL_REGEX.test(email)
    setValidEmail(resultEmail)
  }, [user, email])

  useEffect(() => {
    const result = PWD_REGEX.test(pwd)
    setValidPwd(result)
    const match = pwd === matchPwd
    setValidMatch(match)
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('')
  }, [user, pwd, matchPwd, email])

  return (
    <>
      <Navigation></Navigation>
      <Container>
        <Row className='justify-content-center' xs='auto'>
          <Col
            xs='auto'
            className='justify-content-center border border-warning rounded mt-5'
            style={{ backgroundColor: '#4a4b4f' }}
          >
            <div
              className='border border-warning rounded p-5 my-3'
              style={{ overflow: 'auto', width: '60vw', maxWidth: '500px' }}
            >
              <h1>Register</h1>
              <Form onSubmit={handleSubmit}>
                <Form.Group className='mb-3'>
                  <Form.Label htmlFor='username'>
                    Username:
                    <span className={validName ? 'valid' : 'd-none'}>+</span>
                    <span
                      className={validName || !user ? 'd-none' : 'invalid'}
                      color='red'
                    >
                      -
                    </span>
                  </Form.Label>
                  <Form.Control
                    id='username'
                    type='text'
                    placeholder='Enter username'
                    ref={userRef}
                    autoComplete='off'
                    onChange={(e) => setUser(e.target.value)}
                    required
                    aria-invalid={validName ? false : true}
                    aria-describedby='uidnote'
                  />
                  <p
                    id='uidnote'
                    className={user && !validName ? 'invalid' : 'offcanvas'}
                  >
                    4 to 24 characters. <br />
                    Must begin with a letter <br />
                    Letters, numbers, underscores, hyphens are allowed.
                  </p>
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label htmlFor='email'>E-mail address</Form.Label>
                  <span className={validEmail ? 'valid' : 'd-none'}>+</span>
                  <span
                    className={validEmail || !email ? 'd-none' : 'invalid'}
                    color='red'
                  >
                    -
                  </span>
                  <Form.Control
                    id='email'
                    type='email'
                    placeholder='Enter e-mail'
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-invalid={validEmail ? false : true}
                    aria-describedby='emailnote'
                  />
                  <p
                    id='emailnote'
                    className={email && !validEmail ? 'invalid' : 'offcanvas'}
                  >
                    Must contain @ and a . (dot) followed by a domain (ex: com)!{' '}
                    <br />
                  </p>
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label htmlFor='password'>Password: </Form.Label>

                  <span className={validPwd ? 'valid' : 'd-none'}>+</span>
                  <span
                    className={validPwd || !pwd ? 'd-none' : 'invalid'}
                    color='red'
                  >
                    -
                  </span>
                  <Form.Control
                    id='password'
                    type='password'
                    placeholder='Enter password'
                    onChange={(e) => setPwd(e.target.value)}
                    required
                    aria-invalid={validPwd ? false : true}
                    aria-describedby='pwdnote'
                  />
                  <p
                    id='pwdnote'
                    className={pwd && !validPwd ? 'invalid' : 'offcanvas'}
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
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label htmlFor='confirm_pwd'>
                    Confirm Password
                  </Form.Label>
                  <Form.Control
                    id='confirm_pwd'
                    type='password'
                    placeholder='Enter password again'
                    onChange={(e) => setMatchPwd(e.target.value)}
                    required
                    aria-invalid={validMatch ? false : true}
                    aria-describedby='confirmnote'
                  />
                  <p
                    id='confirmnote'
                    className={!validMatch ? 'invalid' : 'offcanvas'}
                  >
                    Must match the first password input field.
                  </p>
                </Form.Group>
                <button
                  disabled={
                    !validName || !validPwd || !validMatch ? true : false
                  }
                  type='submit'
                  className='btn btn-warning'
                >
                  Register
                </button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
      <span
        style={{
          width: '100%',
          textAlign: 'center',
          display: 'block',
          fontSize: '30px',
          fontWeight: 'bold',
          color: errMsg ? 'red' : 'green',
        }}
      >
        {errMsg !== null ? errMsg : null}
        {succMessage !== null ? succMessage : null}
      </span>
    </>
  )
}
export default Register
