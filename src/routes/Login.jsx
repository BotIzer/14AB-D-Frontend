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
      console.log('start here')
      const response = await axios.post(
        '/login',
        {
          email: email.toLowerCase(),
          password: pwd,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true, //this needs fixing
        }
        )
        // This does not run! WHY?
        console.log(response);
        // const responseUserInfo = await axios.get('/getUserInfo', {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     // 'authorization': `Bearer ${cookies.get('token')}`,
        //   },
        //   withCredentials: true,
        //   credentials: 'include'
        // })
      setPwd('')
      setEmail('')
      // navigate('/')
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response')
      } else if (err.response?.status === 404) {
        setErrMsg(err.response.data.message)
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
              style={{ overflow: 'auto', width: '50vw' }}
            >
              <h1>Sign in</h1>
              <Form onSubmit={HandleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="email">Email address</Form.Label>
                  <Form.Control
                    type="email"
                    // TODO
                    // placeholder= {cookies.get('token') !== undefined ? "Already logged in" : "Enter email"}
                    id="email"
                    ref={emailRef}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-describedby="uidnote"
                    // disabled= {cookies.get('token') !== undefined}
                  />
                  <p
                    id="uidnote"
                    className={email && !validEmail ? 'error' : 'offcanvas'}
                  >
                    Must contain @ and a . (dot) followed by a domain (ex: com)!
                  </p>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="password">Password</Form.Label>
                  <Form.Control
                    type="password"
                    // placeholder= {cookies.get('token') !== undefined ? "Already logged in" : "Enter password"}
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    required
                    aria-describedby="pwdnote"
                    // disabled= {cookies.get('token') !== undefined}
                  />
                </Form.Group>
                <button
                  // disabled={!validEmail || !pwd || cookies.get('token') !== undefined}
                  type="submit"
                  className="btn btn-warning"
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
