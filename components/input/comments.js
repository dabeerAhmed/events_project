// import { useEffect, useState } from "react";

// import CommentList from "./comment-list";
// import NewComment from "./new-comment";
// import classes from "./comments.module.css";

// function Comments(props) {
//   const { eventId } = props;

//   const [showComments, setShowComments] = useState(false);
//   const [comments, setComments] = useState([]);

//   useEffect(() => {
//     if (showComments) {
//       fetch("/api/comments/" + eventId)
//         .then((response) => response.json())
//         .then((data) => {
//           setComments(data.comments);
//         });
//     }
//   }, [showComments]);

//   function toggleCommentsHandler() {
//     setShowComments((prevStatus) => !prevStatus);
//   }

//   function addCommentHandler(commentData) {
//     fetch("/api/comments/" + eventId, {
//       method: "POST",
//       body: JSON.stringify(commentData),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => console.log(data));
//   }

//   return (
//     <section className={classes.comments}>
//       <button onClick={toggleCommentsHandler}>
//         {showComments ? "Hide" : "Show"} Comments
//       </button>
//       {showComments && <NewComment onAddComment={addCommentHandler} />}
//       {showComments && <CommentList items={comments} />}
//     </section>
//   );
// }

// export default Comments;

import { useContext, useEffect, useState } from "react";

import CommentList from "./comment-list";
import NewComment from "./new-comment";
import classes from "./comments.module.css";
import NotificationContext from "../../store/notification-context";

function Comments(props) {
  const { eventId } = props;

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const notificationCtx = useContext(NotificationContext);
  const [isFetchingComments, setIsFetchingComments] = useState(false);

  useEffect(() => {
    if (showComments) {
      setIsFetchingComments(true);
      fetch("/api/comments/" + eventId)
        .then((response) => response.json())
        .then((data) => {
          setComments(data.comments);
          setIsFetchingComments(false);
        });
    }
  }, [showComments]);

  function toggleCommentsHandler() {
    setShowComments((prevStatus) => !prevStatus);
  }

  function addCommentHandler(commentData) {
    notificationCtx.showNotification({
      title: "Adding Comment!...",
      message: "Adding comment for this event",
      status: "pending",
    });

    fetch("/api/comments/" + eventId, {
      method: "POST",
      body: JSON.stringify(commentData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return response.json().then((data) => {
          throw new Error(data.message || "Something went wrong");
        });
      })
      .then((data) => {
        notificationCtx.showNotification({
          title: "Success!",
          message: "Successfully added your comment",
          status: "success",
        });
      })
      .catch((error) => {
        notificationCtx.showNotification({
          title: "Error!",
          message: error.message || "Something went wrong",
          status: "error",
        });
      });
    // .then((response) => response.json())
    // .then((data) => console.log(data))
    // .catch((error) => {
    //   console.error("Error:", error);
    // });
  }

  return (
    <section className={classes.comments}>
      <button onClick={toggleCommentsHandler}>
        {showComments ? "Hide" : "Show"} Comments
      </button>
      {showComments && <NewComment onAddComment={addCommentHandler} />}
      {showComments && !isFetchingComments && <CommentList items={comments} />}
      {showComments && isFetchingComments && <p>Loading...</p>}
    </section>
  );
}

export default Comments;
