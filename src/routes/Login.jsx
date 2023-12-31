import Navigation from "../components/Navigation";
import { Container } from "react-bootstrap";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate} from "react-router-dom";
import axios from '../api/axios'
import { useEffect, useState, useRef } from 'react'

export default function Login(){
  const navigate = useNavigate();

  const EMAIL_REGEX = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/
  const LOGIN_URL = '/login'

  const emailRef = useRef()
  const errRef = useRef()

  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)

  const [pwd, setPwd] = useState('')
  const [pwdFocus, setPwdFocus] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        LOGIN_URL,
        {
          email: email,
          password: pwd,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: false,
        }
      )
      navigate('/');

    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response')
      }
      else if(err.response?.status === 404){
        setErrMsg(err.response.data.message);
      }
      else if (err.response?.status === 401) {
        setErrMsg("Unauthorized")
      }
      else {
        setErrMsg('Login failed')
      }
      errRef.current.focus()
    }
  }
  return (
    <>
      <section>
        <p
          ref={errRef}
          className={errMsg ? 'errmsg' : 'offcanvas'}
          aria-live="assertive"
        >
          {errMsg}
        </p>
      </section>
      <Navigation></Navigation>
      <Container >
        <Row className="justify-content-center" xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto">
          <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" className="justify-content-center border border-warning rounded mt-5" style={{backgroundColor: "#4a4b4f"}}>
            <div className="border border-warning rounded p-5 my-3" style={{overflow: 'auto'}}>
              <h1>Sign in</h1>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="email">Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email"
                    id="email"
                    ref={emailRef}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-describedby="uidnote"
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}/>
                     <p
                    id="uidnote"
                    className={
                      emailFocus && email && !validEmail
                        ? 'instructions'
                        : 'offcanvas'
                    }
                  >
                    Must contain @ and a . (dot) followed by a domain (ex: com)!
                  </p>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="password">Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" 
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    required
                    aria-describedby="pwdnote"
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}/>
                </Form.Group>
                <button type="submit" className="btn btn-warning">Login</button>
              </Form>
              <Link to="/register">Register</Link>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}