import Navigation from '../components/Navigation'
import { Container } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import { useEffect, useState, useRef } from 'react'

const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/

export default function Login() {
  const navigate = useNavigate()

  const emailRef = useRef()
  const errRef = useRef()

  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)

  const [pwd, setPwd] = useState('')

  const [errMsg, setErrMsg] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    emailRef.current.focus()
  }, [])

  useEffect(() => {
    const result = EMAIL_REGEX.test(email)
    setValidEmail(result)
  }, [email])

  useEffect(() => {
    setErrMsg('')
  }, [email, pwd])

  const HandleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(true)
    try {
      const response = await axios.post(
        '/login',
        {
          email: email.toLowerCase(),
          password: pwd,
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
        )
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userInfo',JSON.stringify(response.data.userInfo))
      dispatchEvent(new Event('storage'))
      setPwd('')
      setEmail('')
      navigate('/')
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response')
      } else if (err.response?.status === 404) {
        setErrMsg(err.response.data.message)
      } else if(err.response?.status === 403){
        setErrMsg('Already logged in!')
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized')
      } else {
        setErrMsg('Login failed')
      }
      errRef.current.focus()
    }
  }
  return (
    <>
      <Navigation></Navigation>
      <Container>
        <Row
          className="justify-content-center"
          xs="auto"
        >
          <Col
            xs="auto"
            className="justify-content-center border border-warning rounded mt-5"
            style={{ backgroundColor: '#4a4b4f' }}
          >
            <div
              className="border border-warning rounded p-5 my-3"
              style={{ overflow: 'auto', width: '60vw', maxWidth: '500px'}}
            >
              <h1>Sign in</h1>
              <Form onSubmit={HandleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="email">Email address</Form.Label>
                  <Form.Control
                    type="email"
                     placeholder= {"Enter e-mail"}
                    id="email"
                    ref={emailRef}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-describedby="uidnote"
                  />
                  <p
                    id="uidnote"
                    className={email && !validEmail ? 'invalid' : 'offcanvas'}
                  >
                    Must contain @ and a . (dot) followed by a domain (ex: com)!
                  </p>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="password">Password</Form.Label>
                  <Form.Control
                    type="password"
                     placeholder= {"Enter password"}
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    required
                    aria-describedby="pwdnote"
                  />
                </Form.Group>
                <button
                  type="submit"
                  className="btn btn-warning mb-2"
                >
                  Login
                </button>
              </Form>
              <button
                  onClick={()=>navigate('/register')}
                  className="btn btn-warning"
                >
                  Register
                </button>
            </div>
          </Col>
        </Row>
      </Container>

        <span style={{width: '100%', textAlign: 'center', display: 'block', fontSize: '30px', 
        fontWeight: 'bold', color: errMsg ? 'red' : 'green'}}>
        {errMsg !== null ? errMsg : success !== null ? success : null}</span>

    </>
  )
}
