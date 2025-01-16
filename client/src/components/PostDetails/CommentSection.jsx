import { Button, TextField, Typography } from "@mui/material";
import useStyles from "./styles";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { commentPost } from "../../actions/posts";
const CommentSection = ({ post }) => {
  const [comments, setComments] = useState(post?.comments || []);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const commentsRef = useRef();
  const classes = useStyles();

  const user = JSON.parse(localStorage.getItem("profile"));

  const handleClick = async () => {
    const commentStr = `${user.name}: ${comment}`;
    const newComments = await dispatch(commentPost(commentStr, post._id));
    setComments(newComments);
    setComment("");
    commentsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <div className={classes.commentsOuterContainer}>
        <div className={classes.commentsInnerContainer}>
          <Typography gutterBottom variant="h6">
            Comments
          </Typography>
          {comments.map((c, index) => (
            <Typography key={index} gutterBottom variant="subtitle1">
              <strong>{c.split(": ")[0]}: </strong>
              {c.split(": ")[1]}
            </Typography>
          ))}
          <div ref={commentsRef} />
        </div>
        {user?.name && (
          <div style={{ width: "70%" }}>
            <Typography gutterBottom variant="h6">
              Write a Comment
            </Typography>
            <TextField
              fullWidth
              rows={4}
              variant="outlined"
              label="Comment"
              multiline
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              style={{ marginTop: "10px" }}
              fullWidth
              disabled={!comment}
              variant="contained"
              onClick={handleClick}
            >
              Comment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
