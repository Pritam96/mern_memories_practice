import { CircularProgress, Divider, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import moment from "moment";
import useStyles from "./styles";
import { getPost, getPostsBySearch } from "../../actions/posts";
import CommentSection from "./CommentSection";
import placeHolderImage from "../../images/placeholder.png";


const PostDetails = () => {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();

  const { id } = useParams();

  const openPost = (_id) => {
    navigate(`/posts/${_id}`);
  };

  useEffect(() => {
    if (id) {
      dispatch(getPost(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (post) {
      dispatch(
        getPostsBySearch({ search: "none", tags: post?.tags.join(",") })
      );
    }
  }, [post, dispatch]);

  let recommendedPosts = [];
  if (!isLoading && post)
    recommendedPosts = posts?.filter((p) => p._id !== post._id);

  if (!post) return null;

  if (isLoading)
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );

  return (
    <Paper style={{ padding: "20px", borderRadius: "15px" }} elevation={6}>
      <div className={classes.card}>
        <div className={classes.section}>
          <Typography variant="h3" component="h2">
            {post.title}
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            color="textSecondary"
            component="h2"
          >
            {post.tags.map((tag) => `#${tag} `)}
          </Typography>
          <Typography gutterBottom variant="body1" component="p">
            {post.message}
          </Typography>
          <Typography variant="h6">Created by: {post.name}</Typography>
          <Typography variant="body1">
            {moment(post.createdAt).fromNow()}
          </Typography>
          <Divider style={{ margin: "20px 0" }} />
          <CommentSection post={post} />
          <Divider style={{ margin: "20px 0" }} />
        </div>
        <div className={classes.imageSection}>
          <img
            className={classes.media}
            src={post.selectedFile || placeHolderImage}
            alt={post.title}
          />
        </div>
      </div>
      {recommendedPosts.length && (
        <div className={classes.section}>
          <Typography gutterBottom variant="h5">
            You might also like:
          </Typography>
          <Divider />
          <div className={classes.recommendedPosts}>
            {recommendedPosts.map((p) => (
              <div
                key={p._id}
                style={{ margin: "20px", cursor: "pointer" }}
                onClick={() => openPost(p._id)}
              >
                <Typography gutterBottom variant="h6">
                  {p.title}
                </Typography>
                <Typography gutterBottom variant="subtitle2">
                  {p.name}
                </Typography>
                <Typography gutterBottom variant="subtitle2">
                  {p.message}
                </Typography>
                <Typography gutterBottom variant="subtitle1">
                  Likes: {p.likes.length}
                </Typography>
                <img src={p.selectedFile || placeHolderImage} width="200px" />
              </div>
            ))}
          </div>
        </div>
      )}
    </Paper>
  );
};

export default PostDetails;
