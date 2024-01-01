import Navigation from '../components/Navigation'
import { Container } from 'react-bootstrap'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import axios from '../api/axios'
import { useEffect, useState, useRef } from 'react'

export default function Register() {
  const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/
  const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
  const PWD_REGEX =
    /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/
  const REGISTER_URL = '/register'

  const userRef = useRef()
  const errRef = useRef()

  const [user, setUser] = useState('')
  const [validName, setValidName] = useState(false)

  const [email, setEmail] = useState('')
  const [validEmail, setValidEmail] = useState(false)
  
  const [pwd, setPwd] = useState('')
  const [validPwd, setValidPwd] = useState(false)

  const [matchPwd, setMatchPwd] = useState('')
  const [validMatch, setValidMatch] = useState(false)

  const [errMsg, setErrMsg] = useState('')
  const [success, setSuccess] = useState(false)

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
  }, [user,email])

  useEffect(() => {
    const result = PWD_REGEX.test(pwd)
    setValidPwd(result)
    const match = pwd === matchPwd
    setValidMatch(match)
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('')
  }, [user, pwd, matchPwd, email])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v1 = USER_REGEX.test(user)
    const v2 = PWD_REGEX.test(pwd)
    if (!v1 || !v2) {
      setErrMsg('Invalid Entry')
      return
    }
    try {
      const response = await axios.post(
          REGISTER_URL,
          {
              email: email,
              password: pwd,
              username: user,
          },
          {
              headers: { 'Content-Type': 'application/json' },
              withCredentials: false,
          }
      )
      setErrMsg('User created!')
      setSuccess(true)
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response')
      } else {
        setErrMsg(`${err.response.data.message}`)
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
      {/* TODO: Container dynamic size change with texts looks goofy */}
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
              className="border border-warning rounded px-5 py-2 my-3"
              style={{ overflow: 'auto'}}
            >
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="username">
                    Username:
                    <span className={validName ? 'valid' : 'd-none'}>
                      +
                    </span>
                    <span
                      className={validName || !user ? 'd-none' : 'invalid'}
                      color="red"
                    >
                      -
                    </span>
                  </Form.Label>
                  <Form.Control
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    required
                    aria-invalid={validName ? false : true}
                    aria-describedby="uidnote"
                  />
                  <p
                    id="uidnote"
                    className={
                       user && !validName
                        ? 'error'
                        : 'offcanvas'
                    }
                  >
                    4 to 24 characters. <br />
                    Must begin with a letter <br />
                    Letters, numbers, underscores, hyphens are allowed.
                  </p>
                </Form.Group>
                <Form.Group className="mb-3" >
                  <Form.Label htmlFor='email'>E-mail address</Form.Label>
                  <span className={validEmail ? 'valid' : 'd-none'}>
                      +
                    </span>
                    <span
                      className={validEmail || !email ? 'd-none' : 'invalid'}
                      color="red"
                    >
                      -
                    </span>
                  <Form.Control 
                  id="email" 
                  type="email" 
                  placeholder="Enter e-mail" 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  aria-invalid={validEmail ? false : true}
                  aria-describedby='emailnote'/>
                   <p
                    id="emailnote"
                    className={
                       email && !validEmail
                        ? 'error'
                        : 'offcanvas'
                    }
                  >
                    E-mail address is invalid! <br />
                  </p>
                </Form.Group>
                {/* <Form.Group className="mb-3">
                  <Form.Label htmlFor="password">Password: </Form.Label>

                  <span className={validPwd ? 'valid' : 'd-none'}>
                      +
                    </span>
                    <span
                      className={validPwd || !pwd ? 'd-none' : 'invalid'}
                      color="red"
                    >
                      -
                    </span>
                  <Form.Control
                    id="password"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPwd(e.target.value)}
                    required
                    aria-invalid={validPwd ? false : true}
                    aria-describedby="pwdnote"
                  />
                  <p
                    id="pwdnote"
                    className={
                       pwd && !validPwd
                        ? 'error'
                        : 'offcanvas'
                    }
                  >
                    8 to 24 characters. <br />
                    Must include uppercase and lowercase letters, a number, and
                    a special character. <br />
                    Allowed characters:{' '}
                    <span aria-label="exclamation mark">!</span>
                    <span aria-label="at symbol">@</span>{' '}
                    <span aria-label="hashtag">#</span>
                    <span aria-label="dollar sign">$</span>{' '}
                    <span aria-label="percent">%</span>
                  </p>
                </Form.Group> */}
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="password">Password: </Form.Label>

                  <span className={validPwd ? 'valid' : 'd-none'}>
                      +
                    </span>
                    <span
                      className={validPwd || !pwd ? 'd-none' : 'invalid'}
                      color="red"
                    >
                      -
                    </span>
                  <Form.Control
                    id="password"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPwd(e.target.value)}
                    required
                    aria-invalid={validPwd ? false : true}
                    aria-describedby="pwdnote"
                  />
                  <p
                    id="pwdnote"
                    className={
                       pwd && !validPwd
                        ? 'error'
                        : 'offcanvas'
                    }
                  >
                    8 to 24 characters. <br />
                    Must include uppercase and lowercase letters, a number, and
                    a special character. <br />
                    Allowed characters:{' '}
                    <span aria-label="exclamation mark">!</span>
                    <span aria-label="at symbol">@</span>{' '}
                    <span aria-label="hashtag">#</span>
                    <span aria-label="dollar sign">$</span>{' '}
                    <span aria-label="percent">%</span>
                  </p>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="confirm_pwd">
                    Confirm Password
                  </Form.Label>
                  <Form.Control
                    id="confirm_pwd"
                    type="password"
                    placeholder="Password Again"
                    onChange={(e) => setMatchPwd(e.target.value)}
                    required
                    aria-invalid={validMatch ? false : true}
                    aria-describedby="confirmnote"
                  />
                  <p
                    id="confirmnote"
                    className={
                     !validMatch ? 'error' : 'offcanvas'
                    }
                    
                  >
                    Must match the first password input field.
                  </p>
                </Form.Group>
                <button
                  disabled={
                    !validName || !validPwd || !validMatch ? true : false
                  }
                  type="submit"
                  className="btn btn-warning"
                >
                  Register
                </button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}
