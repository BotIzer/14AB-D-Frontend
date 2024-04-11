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
  const [pageData, setPageData] = useState({currentPage: parseInt(new URLSearchParams(location.search).get('page')) || 0, 
  pageCount: parseInt(new URLSearchParams(location.search).get('page')) || 1})
  
  const handlePaginationClick = (pageNumber) =>{
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
  pages.push(
    <Pagination.Item onClick={()=>handlePaginationClick(pageData.currentPage)} key={pageData.currentPage} active={true}>
      {pageData.currentPage}
    </Pagination.Item>
    )
    if (pageData.currentPage+1 < pageData.pageCount) {
      pages.push(
        <Pagination.Item onClick={()=>handlePaginationClick(pageData.currentPage+1)} key={pageData.currentPage+1} active={false}>
          {pageData.currentPage+1}
        </Pagination.Item>
        )
    }
    else if(pageData.currentPage-1 > 0){
      pages.push(
        <Pagination.Item onClick={()=>handlePaginationClick(pageData.currentPage-1)} key={pageData.currentPage-1} active={false}>
          {pageData.currentPage-1}
        </Pagination.Item>
        )
    }
  useEffect(()=>{
    const GetForumData = async () => {
      const [forumData, threads] =  await Promise.all([
        axios.get(`/forum/${forum_id}`,
        {headers: {
          'Content-Type': 'application/json',
          authorization: `${localStorage.getItem('token') !== null ? 
          `Bearer ${localStorage.getItem('token')}` : 'Bearer null'}`
        },
        withCredentials: true,
      }),
      axios.get(`/forum/getAllThreads/${forum_id}`,
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
  }
     GetForumData()
    //  TODO: fix this ESLint error
  },[])

  useEffect(()=>{
    if(data.forumData.length !== 0){
      console.log(data.threads)
      const img = new Image();
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
    // TODO: Block route to create post and edit forum!
    if(data.forumData.length !== 0){
      const CheckIfIsOwner = async() =>{
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
        // TODO: IF YOU GO TO THE ROUTE, YOU SHOULD BE KICKED OFF
        // WITH ERROR
        setIsSubscribed(data.forumData[0].users.some(user =>  user.user_id === userResponse.data.user._id) || 
        data.forumData[0]._id.creator_id === userResponse.data.user._id)
      }
      CheckIfIsOwner()
    }
  },[data])
  return (
    <>
      <Navigation></Navigation>
      <Container data-bs-theme='dark' fluid>
        {localStorage.getItem('token') !== null && isSubscribed ? <Button
          className='clear-button fixed-bottom-right mb-4'
          style={{ backgroundColor: '#343a40' }}
          onClick={() => navigate(`/forums/${data.forumData[0].forum_name}/${forum_id}/createpost/`)}
        >
          <img
            className='hover-filter-gold'
            src='/src/assets/icons/add_forum.png'
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
                onClick={()=>navigate(`/editforum/${encodeURIComponent(data.forumData[0].forum_name)}/${data.forumData[0]._id.forum_id}`)}>
                  <ReactImage src='/src/assets/icons/edit.png' className='hover-filter-gold'/>
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
        <Pagination.First onClick={()=>handlePaginationClick(1)}/>
        <Pagination.Prev onClick={()=>handlePaginationClick(pageData.currentPage-1 <= 0 ? pageData.pageCount : pageData.currentPage-1)}/>
        {pages}
        <Pagination.Next onClick={()=>handlePaginationClick(pageData.currentPage+1 > pageData.pageCount ? 1 : pageData.currentPage+1)}/>
        <Pagination.Last onClick={()=>handlePaginationClick(pageData.pageCount)}/>
        </Pagination> {/* TODO: Connect pagination to backend*/}
      </Container>
    </>
  )
}

export default Forum
