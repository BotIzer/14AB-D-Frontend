import { useNavigate } from "react-router-dom";
import { Card, Button, Col, Row, ToggleButton, Carousel } from "react-bootstrap";
import { daysDifference } from "./ForumCard"; //<-- idk where to put this
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import MyCarousel from "../components/MyCarousel";

const socket = io('http://localhost:3000', {
  withCredentials: true
});
export default function PostCard({ post }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const [isDisLiked, setIsDisLiked] = useState(false);
  useEffect(()=> {
    socket.on('like',()=>{
      console.log('Like sent');
    })
    return() =>{
      socket.disconnect();
      socket.removeAllListeners();
    }
  },[isLiked])
  useEffect(()=> {
    socket.on('dislike',()=>{
      console.log('Dislike sent');
    })
    return() =>{
      socket.disconnect();
      socket.removeAllListeners();
    }
  },[isDisLiked])

  const LikedThread = (()=>{
    setIsLiked(!isLiked)
    setIsDisLiked(false)
  })
  const DislikedThread = (()=>{
    setIsLiked(false)
    setIsDisLiked(!isDisLiked)
  })
  {console.log(post)}
  return (
    <Card className="text-center p-0 m-3" data-bs-theme="dark" xs={12} md={6}>
      <Card.Header className="primary">{post.name}</Card.Header>
      <Card.Body className="secondary" style={{ height: "200px" }}>
        <Card.Text>{post.content}</Card.Text>{" "}
        <MyCarousel images={post.image_array}></MyCarousel>
        {/*TODO make text cut out if longer than space provided or make it scrollable?*/}
      </Card.Body>
      <Card.Footer>
        <Row>
          <Col className="text-start">
            <ToggleButton
              id={post._id.thread_id + "like"}
              className="image-checkbox position-relative"
              type="checkbox"
              variant="secondary"
              checked={isLiked}
              value="1"
              onChange={(e) => LikedThread()}
            >
              <img
                src="/src/assets/icons/fist_bump_64.png"
                alt="fist-bump"
                className={isLiked ? "filter-gold" : "filter-grey"}
              />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                {post.likes}
              </span>{" "}
            </ToggleButton>
            <ToggleButton
              id={post._id.thread_id + "dislike"}
              className="image-checkbox position-relative"
              type="checkbox"
              variant="secondary"
              checked={isDisLiked}
              value="1"
              onChange={(e) => DislikedThread()}
            >
              <span style={{ borderRight: "2px solid #ffffff" }}></span>
              <img
                src="/src/assets/icons/lightning_64.png"
                alt="skull"
                className={isDisLiked ? "filter-red" : "filter-grey"}
              />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                {post.dislikes}
              </span>
            </ToggleButton>
          </Col>
          <Col className="text-end m-auto">
            <Button
              className="comments-button tertiary position-relative" /*onClick={() => navigate("/post/comments")} TODO make this navigate to comment section*/
            >
              Comments
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                {post.comment_count}
              </span>
            </Button>
          </Col>
        </Row>
      </Card.Footer>
      <Card.Footer className="text-muted">
        Posted {daysDifference(post.postDate, new Date())} days ago
      </Card.Footer>
    </Card>
  );
}
