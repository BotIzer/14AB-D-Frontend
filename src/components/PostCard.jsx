import { useNavigate } from "react-router-dom";
import { Card, Button, Col, Row, ToggleButton, DropdownButton, Dropdown, DropdownDivider } from "react-bootstrap";
import { DaysDifference } from "./ForumCard"; //<-- idk where to put this
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import MyCarousel from "../components/MyCarousel";
import axios from "../api/axios";
export default function PostCard(post) {
  const navigate = useNavigate();
  const [opinion,setOpinion] = useState({isLiked: post.post.likes.users.includes(JSON.parse(localStorage.getItem('userInfo')).username), 
    isDisLiked: post.post.dislikes.users.includes(JSON.parse(localStorage.getItem('userInfo')).username)})
  const [opinionCount, setOpinionCount] = useState({likeCount: post.post.likes.count, 
    dislikeCount: post.post.dislikes.count})
  useEffect(()=>{
    console.log(opinionCount)
  },[opinionCount])
  useEffect(()=>{
    console.log(post)
  },[])
  const SendOpinion = async (opinion) => await axios.post(`/thread/${post.post._id.thread_id}/likeDislike`,
  {
    pressedButton: opinion 
  })
  const LikedThread = (async()=>{
    await SendOpinion("like")
    if (opinion.isLiked) {
      setOpinion({threadId: post.post._id.thread_id, isLiked: false, isDisLiked: false, userToken: localStorage.getItem('token')})
      setOpinionCount({likeCount: opinionCount.likeCount-1, dislikeCount: opinionCount.dislikeCount})
    }
    else{
      if(opinion.isDisLiked){
        setOpinionCount({likeCount: opinionCount.likeCount+1, dislikeCount: opinionCount.dislikeCount-1})
      }
      else{
        setOpinionCount({likeCount: opinionCount.likeCount+1, dislikeCount: opinionCount.dislikeCount})
      }
      setOpinion({threadId: post.post._id.thread_id, isLiked: true, isDisLiked: false, userToken: localStorage.getItem('token')})
      
      
    }
  })

  const DislikedThread = (()=>{
    SendOpinion("dislike")
    if (opinion.isDisLiked) {
      setOpinion({threadId: post.post._id.thread_id, isLiked: false, isDisLiked: false, userToken: localStorage.getItem('token')})
      setOpinionCount({likeCount: opinionCount.likeCount, dislikeCount: opinionCount.dislikeCount-1})
    }
    else{
      if(opinion.isLiked){
        setOpinionCount({likeCount: opinionCount.likeCount-1, dislikeCount: opinionCount.dislikeCount+1})
      }
      else{
        setOpinionCount({likeCount: opinionCount.likeCount, dislikeCount: opinionCount.dislikeCount+1})
      }
      setOpinion({threadId: post.post._id.thread_id, isLiked: false, isDisLiked: true, userToken: localStorage.getItem('token')})
      
    }
  })
  return (
    <Card className="text-center p-0" data-bs-theme="dark" xs={12} md={6}>
      <Card.Header className="primary d-flex justify-content-between">
        {post.post.name}
        <DropdownButton variant="outline-warning" drop="down-centered" title={<img className="filter-gold" src="/src/assets/icons/dots.png" alt="" />}>
        <Dropdown.Item
          className="list-group-item secondary text-center"
          // onClick={() => navigate(`/`)} TODO: make this navigate to editpost, make dropdown items only visible with correct authorizations
        >
        Edit
    </Dropdown.Item>
    <DropdownDivider></DropdownDivider>
    <Dropdown.Item
          className="list-group-item secondary text-center"
        >
        Delete
    </Dropdown.Item>

        </DropdownButton> 
      </Card.Header>
      <Card.Body className="secondary h-auto" style={{ minHeight: "200px" }}>
        <Card.Text>{post.post.content}</Card.Text>{" "}
        {/* TODO: DO SOMETHING WHEN IT'S EMPTY */}
        <MyCarousel images={post.post.image_array ? post.post.image_array : ['Nothing']}></MyCarousel>
        {/*TODO make text cut out if longer than space provided or make it scrollable?*/}
      </Card.Body>
      <Card.Footer>
        <Row>
          <Col xs={3}>
            <ToggleButton
              id={post.post._id && post.post._id.thread_id + "like"}
              className="image-checkbox position-relative"
              type="checkbox"
              variant="secondary"
              checked={opinion.isLiked}
              value="1"
              onChange={() => LikedThread()}
            >
              <img
                src="/src/assets/icons/fist_bump_64.png"
                alt="fist-bump"
                className={opinion.isLiked ? "filter-gold" : "filter-grey"}
              />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                {opinionCount.likeCount}
              </span>{" "}
            </ToggleButton>

            </Col>
            <Col xs={3}>
              <ToggleButton
                id={post.post._id && post.post._id.thread_id + "dislike"}
                className="image-checkbox position-relative"
                type="checkbox"
                variant="secondary"
                checked={opinion.isDisLiked}
                value="1"
                onChange={() => DislikedThread()}
              >
                <img
                  src="/src/assets/icons/lightning_64.png"
                  alt="skull"
                  className={opinion.isDisLiked ? "filter-red" : "filter-grey"}
                />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                  {opinionCount.dislikeCount}
                </span>
              </ToggleButton>
            </Col>
          <Col xs={6} className="text-end">
            <Button
              className="comments-button tertiary position-relative h-100" /*onClick={() => navigate("/post/comments")} TODO make this navigate to comment section*/
            >
              Comments
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                {/* TODO: ADD THIS TO DATABASE */}
                {post.post.comment_count}
              </span>
            </Button>
          </Col>
        </Row>
      </Card.Footer>
      <Card.Footer className="text-muted">
        Posted {DaysDifference(new Date(),post.post.creation_date)} days ago
      </Card.Footer>
    </Card>
  );
}
