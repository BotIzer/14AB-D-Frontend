import Navigation from '../components/Navigation'
import Container from 'react-bootstrap/Container'
import DesktopLayout from '../components/DesktopLayout'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Home() {
  return (
    <>
      <Navigation />
      <Container fluid style={{ height: '800px' }}>
        <div>
          <DesktopLayout></DesktopLayout>
        </div>
      </Container>
    </>
  )
}
