import {Container, Row, Col} from 'react-bootstrap'

function Credits() {
    return(
        <>
        <Container>
            <h1 className='text-center m-5'>Credits to used images</h1>
            <Col>
                <Row className='justify-content-center'>
                    <Col className='text-center'><img src={import.meta.env.VITE_EDIT_BUTTON} alt=""></img></Col>
                    <Col>https://www.flaticon.com/free-icons/edit</Col>
                </Row>
                <Row className='justify-content-center'>
                    <Col className='text-center'><img style={{height: '64px', width: '64px'}} src={import.meta.env.VITE_CREATE_BUTTON} alt=""></img></Col>
                    <Col>https://www.flaticon.com/free-icons/lightning" </Col>
                </Row>
                <Row className='justify-content-center'>
                    <Col className='text-center'><img style={{height: '64px', width: '64px'}} src={import.meta.env.VITE_LIKE_BUTTON} alt=""></img></Col>
                    <Col>https://www.flaticon.com/free-icons/fist-bump</Col>
                </Row>
                <Row className='justify-content-center'>
                    <Col className='text-center'><img style={{height: '64px', width: '64px'}} src={import.meta.env.VITE_CREATE_GROUP_BUTTON} alt=""></img></Col>
                    <Col>https://www.flaticon.com/free-icons/people</Col>
                </Row>
                <Row className='justify-content-center'>
                    <Col className='text-center'><img style={{height: '64px', width: '64px'}} src={import.meta.env.VITE_ADD_FRIEND_BUTTON} alt=""></img></Col>
                    <Col>https://www.flaticon.com/free-icons/add</Col>
                </Row>
                <Row className='justify-content-center'>
                    <Col className='text-center'><img style={{height: '64px', width: '64px'}} src={import.meta.env.VITE_BAN} alt=""></img></Col>
                    <Col>https://www.flaticon.com/free-icons/block</Col>
                </Row>
                <Row className='justify-content-center'>
                    <Col className='text-center'><img style={{height: '64px', width: '64px'}} src={import.meta.env.VITE_PARDON} alt=""></img></Col>
                    <Col>https://www.flaticon.com/free-icons/ui</Col>
                </Row>
                <Row className='justify-content-center'>
                    <Col className='text-center'><img style={{height: '64px', width: '64px'}} src={import.meta.env.VITE_CANCEL} alt=""></img></Col>
                    <Col>https://www.flaticon.com/free-icons/cancel</Col>
                </Row>
                <Row className='justify-content-center'>
                    <Col className='text-center'><img style={{height: '64px', width: '64px'}} src={import.meta.env.VITE_OPTIONS} alt=""></img></Col>
                    <Col>https://www.flaticon.com/free-icons/dots</Col>
                </Row>
                <Row className='justify-content-center'>
                    <Col className='text-center'><img style={{height: '64px', width: '64px'}} src={import.meta.env.VITE_NOTIFS} alt=""></img></Col>
                    <Col>https://www.flaticon.com/free-icons/email</Col>
                </Row>
                <Row className='justify-content-center'>
                    <Col className='text-center'><img style={{height: '64px', width: '64px'}} src={import.meta.env.VITE_TRASH} alt=""></img></Col>
                    <Col>https://www.flaticon.com/free-icons/trash-can</Col>
                </Row>
                <Row className='justify-content-center'>
                    <Col className='text-center'><img style={{height: '64px', width: '64px'}} src={import.meta.env.VITE_INFO} alt=""></img></Col>
                    <Col>https://www.flaticon.com/free-icons/info</Col>
                </Row>
            </Col>
        </Container>
        </>
    )
}

export default Credits