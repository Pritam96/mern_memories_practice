import {
  Button,
  ButtonBase,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";
import useStyles from "./styles";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { deletePost, likePost } from "../../../actions/posts";
import placeHolderImage from "../../../images/placeholder.png";
import { useState } from "react";

const Post = ({ post, setCurrentId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
  const [likes, setLikes] = useState(post?.likes || []);

  const user = JSON.parse(localStorage.getItem("profile"));

  const hasLikedThePost = likes.includes(user?._id);

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent ButtonBase click
    dispatch(deletePost(post._id));
  };

  const handleLike = () => {
    dispatch(likePost(post._id));
    if (hasLikedThePost) {
      setLikes(likes.filter((userId) => userId !== user?._id));
    } else {
      setLikes([...likes, user?._id]);
    }
  };

  const openPost = () => navigate(`/posts/${post._id}`);

  const Likes = () => {
    if (likes?.length > 0) {
      return hasLikedThePost ? (
        <>
          <ThumbUpAltIcon fontSize="small" />
          &nbsp;
          {likes.length > 1
            ? `You and ${likes.length - 1} others`
            : `${likes.length} like${likes.length > 1 ? "s" : ""}`}
        </>
      ) : (
        <>
          <ThumbUpOffAltIcon fontSize="small" />
          &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
        </>
      );
    }

    return (
      <>
        <ThumbUpOffAltIcon fontSize="small" />
        &nbsp; Like
      </>
    );
  };

  return (
    <Card className={classes.card} raised elevation={6}>
      <ButtonBase
        className={classes.cardAction}
        onClick={openPost}
        style={{ display: "block", textAlign: "initial" }}
      >
        <CardMedia
          className={classes.media}
          image={post?.selectedFile || placeHolderImage}
          alt={post?.title || "Post"}
          title={post?.title || "Post"}
          component="div"
        />
        <div className={classes.overlay}>
          <Typography variant="h6">{post?.name || "Anonymous"}</Typography>
          <Typography variant="body2">
            {moment(post?.createdAt).fromNow()}
          </Typography>
        </div>
        <div className={classes.details}>
          <Typography variant="body2" color="textSecondary">
            {post?.tags?.map((tag) => `#${tag}`).join(" ") || ""}
          </Typography>
        </div>
        <Typography className={classes.title} variant="h5" gutterBottom>
          {post?.title || "Untitled Post"}
        </Typography>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {post?.message || "No content available"}
          </Typography>
        </CardContent>
      </ButtonBase>
      {user?._id === post?.creator && (
        <div className={classes.overlay2}>
          <Button
            style={{ color: "white" }}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentId(post._id);
            }}
          >
            <MoreHorizIcon fontSize="default" />
          </Button>
        </div>
      )}
      <CardActions className={classes.cardActions}>
        <Button
          size="small"
          color="primary"
          disabled={!user}
          onClick={handleLike}
        >
          <Likes />
        </Button>
        {user?._id === post?.creator && (
          <Button size="small" color="primary" onClick={handleDelete}>
            <DeleteIcon fontSize="small" /> &nbsp; Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default Post;
