import {Container, Row, Col} from 'react-bootstrap'

function Credits(params) {
    return(
        <>
        <Container>
            <h1>Credits to used images</h1>
            <Col className='overflow-auto'>
                <Row className='justify-content-center'>
                    <Col className='text-center'><img src={import.meta.env.VITE_EDIT_BUTTON} alt=""></img></Col>
                    <Col></Col>
                </Row>
                <Row className='justify-content-center'>
                    <Col className='text-center'><img src={import.meta.env.VITE_EDIT_BUTTON} alt=""></img></Col>
                    <Col></Col>
                </Row>
            </Col>
        </Container>
        </>
    )
}

export default Credits