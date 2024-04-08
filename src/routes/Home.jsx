import Navigation from '../components/Navigation'
import Container from 'react-bootstrap/Container'
import DesktopLayout from '../components/DesktopLayout'
import MobileLayout from '../components/MoblieLayout'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Home() {
  return (
    <>
      <Navigation />
      <Container fluid style={{ height: '800px' }}>
        <div className='sm-hidden'>
          <DesktopLayout></DesktopLayout>
        </div>
        <div className='lg-hidden'>
          <MobileLayout></MobileLayout>
        </div>
      </Container>
    </>
  )
}
