import { Button, FormGroup, Row, Image as ReactImage, DropdownButton, DropdownItem, Container, Table, Col, OverlayTrigger, Tooltip, Form, Tab, Tabs } from 'react-bootstrap'
import Navigation from '../components/Navigation'
import axios from '../api/axios'
import { useLocation, useNavigate, } from 'react-router-dom'
import { useEffect, useState } from 'react'

function EditForum() {
  const location = useLocation()

  const navigate = useNavigate()
  const [tagList, setTagList] = useState([])
  const [previewData, setPreviewData] = useState({
    title: '',
    banner: '',
    description: '',
  })
  const [displayError, setDisplayError] = useState(false)
  const [isBannerValid, setIsBannerValid] = useState(true)
  //TODO replace dummy data  
  const categoryPreview = [
    'gaming',
    'test',
    'e-sports',
    'question'
  ]
  const SaveChanges = async () => {
    const title = document.getElementById('title').value.trim()
    const banner = document.getElementById('banner').value.trim()
    const description = document.getElementById('description').value.trim()
    const forumId = location.pathname.split('/')[3]
    const tags = tagList
    if (title !== '' && banner !== '') {
      // TODO: Display error if title/banner is empty!
      await axios.put(
        `/forum/${forumId}`,
        {
          forum_name: title,
          banner: banner,
          description: description,
          tags: tags
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        }
      )
      navigate(`/forums/${encodeURIComponent(title)}/${forumId}`)
    }
    else{
      setDisplayError(true)
    }
  }
  const Cancel = async () => {
    if (confirm('Are you sure you want to stop editing?')) {
      navigate(`/forums/${location.pathname.split('/')[2]}/${location.pathname.split('/')[3]}`)
    }
  }
  const DeleteForum = async() => {
    if (confirm('Are you sure you want to delete this forum?')) {
      await axios.delete(
        '/forum',
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`,
            forumname: decodeURIComponent(location.pathname.split('/')[2])
          },
          withCredentials: true,
        }
      )
      navigate('/')
    }

  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      AddTag()
    }
  };

  const AddTag = async () => {
    if(document.getElementById('tagUpload').value.trim() !== ''){
      await setTagList(prevItems=>[...prevItems,document.getElementById('tagUpload').value])
      document.getElementById('tagUpload').value = ''
    }
  }
  const HandleSelect = (key) =>{
    if(key === 'preview'){
      setPreviewData({
        title: document.getElementById('title').value,
        tags: tagList,
        banner: document.getElementById('banner').value,
        description: document.getElementById('description').value,
      })
    }
  }



  const categoryList = tagList.map((category)=>(
    <th
          style={{ fontSize: 'small', borderWidth: '2px' }}
          key={category}
          className='text-center'
        >
          <i className='tertiary'>{category}</i>
        </th>
  ))
  const removeTag = (tag) =>{
    setTagList(prevTags => prevTags.filter(item => item !== tag));
  }
useEffect(() => {
  if(localStorage.getItem('token') === null){
    navigate('/')
  }
  const GetPreviewData = async () => {
    const response = await axios.get(`/forum/${location.pathname.split('/')[3]}`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      withCredentials: true,
    })
    setPreviewData({
      title: response.data[0].forum_name,
      banner: response.data[0].banner,
      description: response.data[0].description,
    })
    setTagList(response.data[0].tags)
    document.getElementById('title').value = response.data[0].forum_name
    document.getElementById('banner').value = response.data[0].banner
    document.getElementById('description').value = response.data[0].description
  }
  GetPreviewData()
},[location.pathname])

useEffect(()=>{
  const img = new Image();
    img.src = previewData.profile_image;
    img.onload = ()=>{
      setIsBannerValid(true)
    }
    img.onerror = () => {
      setIsBannerValid(false);
    };
},[previewData.banner])

  return (
    <>
      <Navigation></Navigation>
      <Tabs
        defaultActiveKey='editUser'
        className='d-flex mb-5 mx-auto my-5 text-nowrap'
        style={{ width: '40vw', borderBottom: 'none' }}
        onSelect={HandleSelect}
        justify
      >
        <Tab eventKey='editUser' title='Edit' className='border tab-size p-2'>
          <FormGroup
            className='p-2 w-100 h-100 text-center'
            data-bs-theme='dark'
          >
            <Form.Label className='secondary'>Title</Form.Label>
            <Form.Control
              size='lg'
              type='text'
              placeholder='title'
              className='mb-3 title text-center'
              id='title'
            />
          </FormGroup>
          <FormGroup data-bs-theme='dark' className='w-100'>
            <div className='d-flex justify-content-around m-2 secondary'>
              {/* TODO: fill it with tags dynamically */}
                <DropdownButton
                  data-bs-theme='dark'
                  drop='down-centered'
                  title='Tags:'
                  className='dropdown-button w-25'
                >
                  {tagList.map((item,index) => (
                    <DropdownItem key={index} className='text-center' id={item}>
                      <Row className='justify-content-around'><Col className='my-auto'>{item}</Col> <Col><Button onPointerDown={()=>removeTag(item)} onMouseEnter={() =>            
                       {document.getElementById(item).className = 'text-center dropdown-item bg-danger'}} onMouseLeave={() => 
                        {document.getElementById(item).className = 'text-center dropdown-item'}} style={{border: 'none'}} 
                        variant='outline-danger' className='p-0'><img className='filter-red hover-filter-black' src='/src/assets/icons/trash.png' alt='trash' /></Button></Col></Row>
                    </DropdownItem>
                  ))}
                </DropdownButton>
                <Form.Control
                  className='w-50 mx-3'
                  placeholder='add tags here'
                  id='tagUpload'
                  onKeyDown={(event)=>handleKeyDown(event)}
                ></Form.Control>
                <Button
                  variant='outline-warning'
                  className='custom-button w-25'
                  onClick={() => AddTag()}
                >
                  Add
                </Button>
              </div>
          </FormGroup>

          <FormGroup
            className='p-2 w-100 h-100 text-center'
            data-bs-theme='dark'
          >
            <Form.Label className='secondary'>Banner</Form.Label>
            <Form.Control
              className='text-center mb-3'
              data-bs-theme='dark'
              placeholder='paste banner link here'
              id='banner'
            ></Form.Control>
            <OverlayTrigger placement='right' overlay={<Tooltip>Note: banners with an aspect ratio of 6:1 work best, other pictures may appear stretched or shrunk</Tooltip>}>
              <ReactImage className='hover-filter-gold' src='/src/assets/icons/info.png'></ReactImage>
            </OverlayTrigger>
          </FormGroup>
          <FormGroup className='text-center' data-bs-theme='dark'>
            <Form.Label className='secondary'>Description</Form.Label>
            <Form.Control
              className='text-center'
              as='textarea'
              placeholder='enter description'
              id='description'
            ></Form.Control>
            {displayError ? <div><span className='invalid'>Title or Banner picture field is empty!</span></div> : null}
          </FormGroup>
          <div
            className='d-flex justify-content-around my-3'
            style={{ borderTop: '1px solid white' }}
          >
            <Button
              variant='outline-warning'
              size='lg'
              onClick={() =>
                SaveChanges()
              }
              className='mt-3'
            >
              Save
            </Button>
            <Button
              variant='outline-danger'
              size='lg'
              onClick={() => Cancel()}
              className='mt-3'
            >
              Cancel
            </Button>
          </div>
        </Tab>
        <Tab
          eventKey='deleteForum'
          title='Delete Forum'
          className='tab-size p-2 text-center'
        >
          <Button
            variant='outline-danger'
            size='lg'
            onClick={() => DeleteForum()} //TODO rename function
            className='mt-3'
          >
            Delete Forum
          </Button>
        </Tab>
        <Tab eventKey='preview' title='Preview' className='tab-size'>
        <Container fluid>
        <Row
          className='p-2'
          style={{
            backgroundImage: `url(${isBannerValid ? previewData.banner : import.meta.env.VITE_BFF_DEFAULT})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            height: '20vh',
          }}
        >
          <h1 className='text-outline text-center m-auto'>
            {previewData.title}
          </h1>
        </Row>
        <Row className='no-padding-table'>
          <Table responsive className='m-0' data-bs-theme='dark'>
            <tbody>
              <tr>{categoryList}</tr>
            </tbody>
          </Table>
        </Row>
        <Row className='secondary'>
          <div className='text-center p-5 custom-border'>
            <i>{previewData.description}</i>
          </div>
        </Row>
        <Col xs={12} md={{ span: 6, offset: 3 }}>
        </Col>
      </Container>
        </Tab>
      </Tabs>
    </>
  )
}

export default EditForum
