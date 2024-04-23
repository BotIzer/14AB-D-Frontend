import Navigation from '../components/Navigation'
import { Col, Row, Container, Table, Button, Image as ReactImage, Pagination } from 'react-bootstrap'
import PostCard from '../components/PostCard'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from '../api/axios'
import { useEffect, useState } from 'react'

function Forum() {
  const navigate = useNavigate()
  const location = useLocation()
  const forum_id = useParams(location.pathname.split('/')[2]).forumId
  const [data,setData] = useState({
    forumData: [],
    threads: []
  })
  const [isBannerValid, setIsBannerValid] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [userId, setUserId] = useState('')
  const [pageData, setPageData] = useState({currentPage: parseInt(new URLSearchParams(location.search).get('page')) || 1, 
  pageCount: parseInt(new URLSearchParams(location.search).get('page')) || 1})

  const [showError, setShowError] = useState(false)
  const [error, setError] = useState('')
  
  const handlePaginationPointerDown = (pageNumber) =>{
    setPageData(prevState => ({
      ...prevState,
      currentPage: pageNumber
    }))
    navigate(`${location.pathname}?page=${pageNumber}`)
  } 

  const categoryList = data.forumData[0] && data.forumData[0].tags.map((category)=>(
    <th
          style={{ fontSize: 'small', borderWidth: '2px' }}
          key={category}
          className='text-center'
        >
          <i className='tertiary'>{category}</i>
        </th>
  ))
  const postList = data.threads && data.threads.map((thread) => (
    <Row key={thread._id.thread_id} className='my-3 p-3'>
      <PostCard isCreator={thread._id.creator_id === userId} post={thread}></PostCard>
    </Row>
  ))

  let pages = []
  if(pageData.currentPage-1 > 0){
    pages.push(
      <Pagination.Item onPointerDown={()=>handlePaginationPointerDown(pageData.currentPage-1)} key={pageData.currentPage-1} active={false}>
        {pageData.currentPage-1}
      </Pagination.Item>
      )
  }
  pages.push(
    <Pagination.Item onPointerDown={()=>handlePaginationPointerDown(pageData.currentPage)} key={pageData.currentPage} active={true}>
      {pageData.currentPage}
    </Pagination.Item>
    )
    if (pageData.currentPage+1 <= pageData.pageCount) {
      pages.push(
        <Pagination.Item onPointerDown={()=>handlePaginationPointerDown(pageData.currentPage+1)} key={pageData.currentPage+1} active={false}>
          {pageData.currentPage+1}
        </Pagination.Item>
        )
    }
  useEffect(()=>{
    if(data.forumData.length !== 0){
      const img = new Image()
      img.src = data.forumData[0].banner
      img.onload = ()=>{
        setIsBannerValid(true)
      }
      img.onerror = ()=>{
        setIsBannerValid(false)
      }
    }
  },[data.forumData])
  useEffect(()=>{
    if(data.forumData.length !== 0){
      const CheckIfIsOwner = async() =>{
        try {
          const userResponse = await axios.get(
            `/user/${JSON.parse(localStorage.getItem('userInfo')).username}`,
            {
              headers: { 'Content-Type': 'application/json' },
            }
          )
          setUserId(userResponse.data.user._id)
          if(data.forumData[0]._id.creator_id === userResponse.data.user._id){
            setIsOwner(true)
          }
          else{
            setIsOwner(false)
          }
          setIsSubscribed(data.forumData[0].users.some(user =>  user.user_id === userResponse.data.user._id) || 
          data.forumData[0]._id.creator_id === userResponse.data.user._id)
        } catch (error) {
          setError('Could not get user data!')
          setShowError(true)
        }
      }
      CheckIfIsOwner()
    }
  },[data])
  useEffect(()=>{
    const GetForumData = async () => {
      try {
      const [forumData, threads] =  await Promise.all([
        axios.get(`/forum/${forum_id}`,
        {headers: {
          'Content-Type': 'application/json',
          authorization: `${localStorage.getItem('token') !== null ? 
          `Bearer ${localStorage.getItem('token')}` : 'Bearer null'}`
        },
        withCredentials: true,
      }),
      axios.get(`/forum/getAllThreads/${forum_id}?page=${pageData.currentPage-1}`,
        {headers: {
          'Content-Type': 'application/json',
          authorization: `${localStorage.getItem('token') !== null ? 
          `Bearer ${localStorage.getItem('token')}` : 'Bearer null'}`
        },
      })])
      setData({
        forumData: forumData.data,
        threads: threads.data.threads
      })
      setPageData({currentPage: pageData.currentPage, pageCount: threads.data.pagesCount})
      } catch (error) {
        setError('Could not get forum data!')
        setShowError(true)
      }
  }
     GetForumData()
  },[location])
  return (
    <>
      <Navigation></Navigation>
      {showError ? <div className='text-center'><span className='invalid'>{error}</span></div> : null}
      <Container data-bs-theme='dark' fluid>
        {localStorage.getItem('token') !== null && isSubscribed ? <Button
          className='clear-button fixed-bottom-right mb-4'
          style={{ backgroundColor: '#343a40' }}
          onPointerDown={() => navigate(`/forums/${data.forumData[0].forum_name}/${forum_id}/createpost/`)}
        >
          <img
            className='hover-filter-gold'
            src={import.meta.env.VITE_CREATE_BUTTON}
            alt='add forum'
          />
        </Button> : null}
        <Row
          className='p-2'
          style={{
            backgroundImage: data.forumData[0] && isBannerValid ? `url(${data.forumData[0].banner})` : `url(${import.meta.env.VITE_BFF_DEFAULT})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            height: '20vh',
          }}
        >
          <h1 className='text-outline text-center m-auto'>
            {data.forumData[0] && data.forumData[0].forum_name}
          </h1>
          {localStorage.getItem('token') !== null && isOwner ? <Button className='position-absolute end-0 rounded-pill clear-button' 
                style={{width: 'auto', height: 'auto'}} 
                onPointerDown={()=>navigate(`/editforum/${encodeURIComponent(data.forumData[0].forum_name)}/${data.forumData[0]._id.forum_id}`)}>
                  <ReactImage src={import.meta.env.VITE_EDIT_BUTTON} className='hover-filter-gold'/>
          </Button> : null}
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
            <i>{data.forumData[0] && data.forumData[0].description}</i>
          </div>
        </Row>
        <Col xs={12} md={{ span: 6, offset: 3 }}>
          {postList}
        </Col>
        <Pagination className='justify-content-center custom-pagination'>
        <Pagination.First onPointerDown={()=>handlePaginationPointerDown(1)}/>
        <Pagination.Prev onPointerDown={()=>handlePaginationPointerDown(pageData.currentPage-1 <= 0 ? pageData.pageCount : pageData.currentPage-1)}/>
        {pages}
        <Pagination.Next onPointerDown={()=>handlePaginationPointerDown(pageData.currentPage+1 > pageData.pageCount ? 1 : pageData.currentPage+1)}/>
        <Pagination.Last onPointerDown={()=>handlePaginationPointerDown(pageData.pageCount)}/>
        </Pagination>
      </Container>
    </>
  )
}

export default Forum
