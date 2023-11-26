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
const PWD_REGEX = /^(?=(.[a-z]){1,})(?=(.[A-Z]){1,})(?=(.[0-9]){1,})(?=(.[!@#$%^&*()-__+.]){1,}).{8,}$/;

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
  
}


  return (
    <>
      <section>
        <p ref={errRef} className={errMsg ? "errmsg":"offscreen"} aria-live="assertive">{errMsg}</p>
      </section>
      <Navigation></Navigation>
      <Container >
        <Row className="justify-content-center" xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto">
          <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto" xxl="auto" className="justify-content-center border border-warning rounded mt-5" style={{backgroundColor: "#4a4b4f"}}>
            <div className="border border-warning rounded px-5 py-2 my-3" style={{height: "400px"}}>
              <Form>
              <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username: 
                    {/* TODO: Fix this thing */}
                    <span class="hide" className=".d-none" color="green">+</span>
                    <span className={validName || !user ? "hide" : "invalid"} color="red">-</span>
                  </Form.Label>
                  <Form.Control type="text" placeholder="Enter username"
                   ref={userRef} autoComplete="off" onChange={(e)=>setUser(e.target.value)}
                   required aria-invalid={validName?"false":"true"} aria-describedby="uidnote" 
                   nFocus={()=>setUserFocus(true)} onBlur={()=> setUserFocus(false)}/>
                   <p id="uidnote" className={userFocus && user && !validName ? "instructions": "offscreen"}>
                    4 to 24 characters. <br/>
                    Must begin with a letter <br/>
                    Letters, numbers, underscores, hyphens are allowed.
                   </p>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" placeholder="Password Again" />
                </Form.Group>
                <button type="submit" className="btn btn-warning">Register</button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}