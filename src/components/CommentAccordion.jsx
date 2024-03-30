import {
  Accordion,
  AccordionContext,
  Card,
  useAccordionButton,
  ToggleButton,
  Row,
  Col,
  Button
} from "react-bootstrap";
import { DaysDifference } from "./ForumCard";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";

function ContextAwareToggle({ children, eventKey, callback }) {
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey)
  );

  const isCurrentEventKey = activeEventKey === eventKey;

  return (
    <button style={{width: "30px", height: "30px"}} className="m-2" type="button" onClick={decoratedOnClick}>
      {isCurrentEventKey ? "-" : "+"}
    </button>
  );
}

export default function CommentAccordion(props) {

  const [isLiked, setIsLiked] = useState(false);

  const dummyCreator = {
    _id: 1,
    name: "Béla",
  };
  const dummyComment = {
    _id: {
      room_id: 1,
      creator_id: 1,
      message_id: 1,
    },
    text: "Nem dolgozol eleget",
    reply: {
      is_reply: false,
      parent_comment_id: null,
      sequential_number: 0,
    },
    creation_date: Date.now(),
    likes: 10,
    dislikes: 2,
    emoticons: [],
  };


  const LikedThread = (()=>{
    if (opinion.isLiked) {
      setOpinion({threadId: post.post._id.thread_id, isLiked: false, isDisLiked: false, userToken: localStorage.getItem('token')})
    }
    else{
      setOpinion({threadId: post.post._id.thread_id, isLiked: true, isDisLiked: false, userToken: localStorage.getItem('token')})
    }
  })

  const DislikedThread = (()=>{
    if (opinion.isDisLiked) {
      setOpinion({threadId: post.post._id.thread_id, isLiked: false, isDisLiked: false, userToken: localStorage.getItem('token')})
    }
    else{
      setOpinion({threadId: post.post._id.thread_id, isLiked: false, isDisLiked: true, userToken: localStorage.getItem('token')})
    }
  })
  //TODO make togglebuttons work plz :)
  return (
    <>
      <Accordion
        data-bs-theme="dark"
        className={props.className}
        style={props.style}
        defaultActiveKey="0"
      >
        <Card>
          <Card.Header className="text-muted" as={Row}>
            <Col className="w-50" >
              <ContextAwareToggle eventKey="0">+</ContextAwareToggle>
              <i style={{ fontSize: "small" }}>
                <Link className="chat-name secondary">{dummyCreator.name}</Link>{" "}
                - {DaysDifference(dummyComment.creation_date, Date.now())} days
                ago
              </i>
            </Col>
            <Col className="w-50 text-end">
              <ToggleButton
                // id={post.post._id && post.post._id.thread_id + "like"}
                id={1}
                className="image-checkbox position-relative"
                type="checkbox"
                variant="secondary"
                // checked={opinion.isLiked}
                checked={isLiked}
                value="1"
                onChange={() => LikedThread()}
              >
                <img
                  src="/src/assets/icons/fist_bump_32.png"
                  alt="fist-bump"
                  className={isLiked ? "filter-gold" : "filter-grey"}
                />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                  {dummyComment.likes}
                </span>{" "}
              </ToggleButton>

              <ToggleButton
                // id={post.post._id && post.post._id.thread_id + "dislike"}
                id={2}
                className="image-checkbox position-relative"
                type="checkbox"
                variant="secondary"
                // checked={opinion.isDisLiked}
                checked={!isLiked}
                value="1"
                onChange={() => DislikedThread()}
              >
                <img
                  src="/src/assets/icons/lightning_32.png"
                  alt="skull"
                  className={!isLiked ? "filter-red" : "filter-grey"}
                />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                  {dummyComment.dislikes}
                </span>
              </ToggleButton>
            </Col>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="text-wrap">{dummyComment.text}</Card.Body>
          </Accordion.Collapse>
          <Card.Footer>
            <Row style={{fontSize: "small"}}  className="text-center">
              <Col><Button variant="outline-warning" className="custom-button" style={{fontSize: "small", border: "gold solid 1px"}}>Replies</Button></Col>
              <Col><Button variant="outline-warning" className="custom-button" style={{fontSize: "small", border: "gold solid 1px"}}>...</Button></Col> 
              {/* TODO make second button show  options, make replies open chatwindow*/}
            </Row>
          </Card.Footer>
        </Card>
      </Accordion>
    </>
  );
}
