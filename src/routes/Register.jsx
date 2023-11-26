import Navigation from "../components/Navigation";
import { Container } from "react-bootstrap";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import axios from '../api/axios'
import { useEffect, useState, useRef } from "react";

export default function Register(){

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/;
const PWD_REGEX = /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/;
const REGISTER_URL = '/register';

const userRef = useRef();
const errRef = useRef();

const [user,setUser] = useState('');
const [validName,setValidName] = useState(false);
const [userFocus,setUserFocus] = useState(false);

const [pwd,setPwd] = useState('');
const [validPwd,setValidPwd] = useState(false);
const [pwdFocus,setPwdFocus] = useState(false)

const [matchPwd,setMatchPwd] = useState('');
const [validMatch,setValidMatch] = useState(false);
const [matchFocus, setMatchFocus] = useState(false);

const [errMsg,setErrMsg] = useState('');
const [success,setSuccess] = useState(false);

useEffect(() =>{
  userRef.current.focus();
}, [])

useEffect(()=>{
const result = USER_REGEX.test(user);
// TODO: REMOVE
console.log(result);
console.log(user);
setValidName(result);
},[user])

useEffect(()=>{
  const result = PWD_REGEX.test(pwd);
  // TODO: REMOVE
  console.log(result);
  console.log(pwd);
  setValidPwd(result);
  const match = pwd === matchPwd;
  setValidMatch(match);
  },[pwd,matchPwd])

  useEffect(()=>{
    setErrMsg('');
  },[user,pwd,matchPwd])

const handleSubmit = async (e)=>{
  try {
    const response = await axios.post(REGISTER_URL,
      JSON.stringify({user,pwd}),
      {
        headers: {'Content-Type': 'application/json'},
        withCredentials: true
      })
      console.log(response.data);
      console.log(response.accessToken);
      console.log(JSON.stringify(response));
      setSuccess(true);
  } catch (error) {
    if (!err?.response) {
      setErrMsg('No Server Response');
    }
    else if (err.response?.status === 409){
      setErrMsg('Username Taken');
    }
    else{
      setErrMsg('Registration failed');
    }
    errRef.current.focus();
  }
}


  return (
    <>
      <section>
        <p ref={errRef} className={errMsg ? "errmsg":"offcanvas"} aria-live="assertive">{errMsg}</p>
      </section>
      <Navigation></Navigation>
      <Container >
        <Row className="justify-content-center" xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto">
          <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" className="justify-content-center border border-warning rounded mt-5" style={{backgroundColor: "#4a4b4f"}}>
            <div className="border border-warning rounded px-5 py-2 my-3" style={{overflow:"auto"}}>
              <Form>
              <Form.Group className="mb-3">
                  <Form.Label htmlFor="username">Username: 
                    {/* TODO: Fix this thing */}
                    <span className={validName || !user ? "valid" : "d-none"}>+</span>
                    <span className={validName || !user ? "d-none" : "invalid"} color="red">-</span>
                  </Form.Label>
                  <Form.Control id="username" type="text" placeholder="Enter username"
                   ref={userRef} autoComplete="off" onChange={(e)=>setUser(e.target.value)}
                   required aria-invalid={validName?"false":"true"} aria-describedby="uidnote" 
                   onFocus={()=>setUserFocus(true)} onBlur={()=> setUserFocus(false)}/>
                   <p id="uidnote" className={userFocus && user && !validName ? "instructions": "offcanvas"}>
                    4 to 24 characters. <br/>
                    Must begin with a letter <br/>
                    Letters, numbers, underscores, hyphens are allowed.
                   </p>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="password">Password: </Form.Label>
                  <Form.Control id="password" type="password" placeholder="Password" onChange={(e)=> setPwd(e.target.value)} required
                  aria-invalid={validPwd? "false" : true} aria-describedby="pwdnote" onFocus={() => setPwdFocus(true)} 
                  onBlur={()=> setPwdFocus(false)}/>
                  <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offcanvas"}>
                    8 to 24 characters. <br/>
                    Must include uppercase and lowercase letters, a number, and 
                    a special character. <br/>
                    Allowed characters: <span aria-label="exclamation mark">!</span>
                    <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span>
                    <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                  </p>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="confirm_pwd">Confirm Password</Form.Label>
                  <span className={validMatch && matchPwd ? "valid" : "hide"}>+</span>
                  <span className={validMatch || !matchPwd ? "hide" : "invalid"}>-</span>
                  <Form.Control id="confirm_pwd" type="password" placeholder="Password Again" 
                  onChange={(e)=> setMatchPwd(e.target.value)} required aria-invalid={validMatch?"false":"true"}
                  aria-describedby="confirmnote" onFocus={() => setMatchFocus(true)} onBlur={()=> setMatchFocus(false)}/>
                </Form.Group>
                <button disabled={!validName || !validPwd || !validMatch ? true : false} type="submit" className="btn btn-warning" 
                onClick={()=>handleSubmit()}>Register</button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}