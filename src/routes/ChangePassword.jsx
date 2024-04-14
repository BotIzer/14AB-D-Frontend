import Navigation from '../components/Navigation'
import {Container, Row, Button} from 'react-bootstrap'
import { useEffect, useState } from 'react'
import axios from '../api/axios'
import { useLocation, useNavigate } from 'react-router-dom'

function ChangePassword() {
    const location = useLocation()
    const navigate = useNavigate() 

    const [response, setResponse] = useState(null)
    const [isVerified, setIsVerified] = useState(true)

    useEffect(() => {
        const path = `${import.meta.env.VITE_PASSWORD_VERIFICATION}/${location.pathname.split('/')[2]}`
        console.log(path)
        const VerifyChangePassword = async () => {
           const response = await axios.get(path, {
                    headers: {
                      'Content-Type': 'application/json',
                      authorization: `Bearer null`,
                    },
                    withCredentials: true,
                  })
                  setResponse(response.data)
        }
        VerifyChangePassword()
    },[])
  return (
    <>
      <Navigation />
      <Container className='text-center' fluid>
        {isVerified? <Row className='m-5 p-2 border border-success text-success' style={{ backgroundColor: '#4a4b4f' }}>
          <h1>Verification successful!</h1> <p>You will be rerouted shortly!</p><Button onClick={() => navigate('/')}>Home</Button>
        </Row>: <Row className='mt-5 p-2 border border-danger text-danger' style={{ backgroundColor: '#4a4b4f' }}>
          <h1>Verification failed!</h1><p>Something went wrong! Try verifying again.</p> <Button onClick={() => navigate('/')}>Home</Button>
        </Row>}
      </Container>
    </>
  )
}
export default ChangePassword