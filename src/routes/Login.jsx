import Navigation from "../components/Navigation";
import { Container } from "react-bootstrap";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";
import axios from '../api/axios'
import { useEffect, useState, useRef } from 'react'

export default function Login(){
  const EMAIL_REGEX = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/
  const PWD_REGEX =
    /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/
  const LOGIN_URL = '/login'

  const emailRef = useRef()
  const errRef = useRef()

  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)

  const [pwd, setPwd] = useState('')
  const [validPwd, setValidPwd] = useState(false)
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
    const v1 = EMAIL_REGEX.test(email)
    const v2 = PWD_REGEX.test(pwd)
    if (!v1 || !v2) {
      setErrMsg('Invalid Entry')
      return
    }
    try {
      const response = await axios.get(
        LOGIN_URL,
        {
          email: 'randomemail@randomemail.com',
          password: 'RandomPassworfd123!',
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: false,
        }
      )
      setSuccess(true)
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response')
      } else {
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
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="email">Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email"
                    id="email"
                    ref={emailRef}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-invalid={validEmail ? false : true}
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
                    Must contain @ and . characters!
                  </p>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="password">Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" 
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    required
                    aria-invalid={validPwd ? false : true}
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