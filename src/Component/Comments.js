import { useState } from 'react'
import data from '../data.json'
import AddComments from './AddComments'
import ReplyComments from './ReplyComments'
import DeleteComments from './DeleteComments'

const Comments = () => {
  const [comments, setComments] = useState(data.comments)
  const [commentValue, setCommentValue] = useState('')
  const [displayDeleteBox, setDisplayDeleteBOx] = useState(false)
  const [deleteCommentId, setDeleteCommentId] = useState()
  const [replyValue, setReplyValue] = useState('')
  const [editValue, setEditValue] = useState('')
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [selectedCommentIdFOrEdit, setSelectedCommentIdFOrEdit] = useState(null);
  const [selectedReplyIdFOrEdit, setSelectedReplyIdFOrEdit] = useState(null);

  const onIcrement = (id) => {
    if (id == parseInt(id)) {
      setComments((comments) =>
        comments.map((comment) =>
          comment.id === id ? { ...comment, score: comment.score + 1 } : comment
        )
      );
    } else {
      const currentComment = comments.find(comment => comment.id === parseInt(id))
      const updatedReply = currentComment.replies.map((reply) => {
        if (reply.id === id) {
          return {
            ...reply,
            score: reply.score + 1
          }
        }
        return reply
      })
      const updatedComment = comments.map((comment) => {
        if (comment.id === currentComment.id) {
          return {
            ...comment,
            replies: updatedReply
          }
        }
        return comment
      })
      setComments(updatedComment)
    }
  }

  const onDecrement = (id) => {
    if (id == parseInt(id)) {
      setComments((comments) =>
        comments.map((comment) =>
          comment.id === id && comment.score !== 0 ? { ...comment, score: comment.score - 1 } : comment
        )
      );
    } else {
      const currentComment = comments.find(comment => comment.id === parseInt(id))
      const updatedReply = currentComment.replies.map((reply) => {
        if (reply.id === id && reply.score !== 0) {
          return {
            ...reply,
            score: reply.score - 1
          }
        }
        return reply
      })
      const updatedComment = comments.map((comment) => {
        if (comment.id === currentComment.id) {
          return {
            ...comment,
            replies: updatedReply
          }
        }
        return comment
      })
      setComments(updatedComment)
    }
  }

  const addComments = () => {
    const updatedComments = [...comments, {
      id: comments.length + 1,
      content: commentValue,
      createdAt: 'just now',
      replies: [],
      score: 0,
      user: {
        image: { png: "./images/avatars/image-juliusomo.png" },
        username: data.currentUser.username
      }
    }]
    if (commentValue !== '') {
      setComments(updatedComments)
      setCommentValue('')
    } else {
      alert('fields are required')
    }
  }
  const showDeleteConfirmation = (id) => {
    setDisplayDeleteBOx(true)
    setDeleteCommentId(id)
  }
  const deleteComment = (commentId) => {
    const indexOfComment = comments.findIndex((comment) => comment.id == commentId)

    if (indexOfComment >= 0) {
      const cloneArrayForDelete = [...comments]
      const one = cloneArrayForDelete.splice(indexOfComment, 1)
      setComments(cloneArrayForDelete)
    }
  }

  const deleteReply = (commentId, replyId) => {
    const currentComment = comments.find(comment => comment.id === commentId);
    const indexOfReply = currentComment.replies.findIndex((reply) => reply.id == replyId)
    const cloneOfReplyForDelete = comments[commentId - 1].replies
    cloneOfReplyForDelete.splice(indexOfReply, 1)
    const updatedCommentsAfterDelete = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...currentComment.replies, cloneOfReplyForDelete],
        };
      }
      return comment;
    });
    setComments(updatedCommentsAfterDelete)
  }

  const handleReplying = (id) => {
    setSelectedCommentId(id);
  }

  const sendReply = () => {
    if (selectedCommentId == parseInt(selectedCommentId)) {

      if (replyValue == '') {
        setSelectedCommentId(null)
      } else {
        const currentCommentedPost = comments.find(comment => comment.id === selectedCommentId);
        const newReply = {
          id: currentCommentedPost.id + (currentCommentedPost.replies.length + 1) / 10,
          content: replyValue,
          createdAt: 'just now',
          replyingTo: currentCommentedPost.user.username,
          score: 0,
          user: {
            image: { png: "./images/avatars/image-juliusomo.png" },
            username: data.currentUser.username
          },
        }

        const updatedReplies = [...currentCommentedPost.replies, newReply];
        const updatedComments = comments.map(comment => {

          if (comment.id === selectedCommentId) {
            return {
              ...comment,
              replies: updatedReplies,
            };
          }
          return comment;
        });
        setComments(updatedComments);
        setReplyValue('');
        setSelectedCommentId(null)
      }
    } else {
      if (replyValue == '') {
        setSelectedCommentId(null)
      } else {
        const currentCommentedPost = comments.find((comment) => comment.id == parseInt(selectedCommentId))
        const replyOfcurrentCommentedPost = currentCommentedPost.replies && currentCommentedPost.replies.find((reply) => reply.id == selectedCommentId)
        const replyOfReply = {
          content: replyValue,
          createdAt: 'just now',
          replyingTo: replyOfcurrentCommentedPost.user.username,
          score: 0,
          user: {
            image: { png: "./images/avatars/image-juliusomo.png" },
            username: data.currentUser.username
          }
        }
        const newArray = Array.from([])
        const index = parseInt((selectedCommentId - currentCommentedPost.id) * 10) - 1
        currentCommentedPost.replies[index].replies = newArray
        const updateReplyOfReply = [...currentCommentedPost.replies[0].replies, replyOfReply]
        const updatedReplies = currentCommentedPost.replies.map((reply) => {
          if (reply.id == selectedCommentId) {
            return {
              ...reply,
              replies: updateReplyOfReply
            }
          }
          return reply
        })

        const updatedComments = comments.map(comment => {
          if (comment.id === parseInt(selectedCommentId)) {
            return {
              ...comment,
              replies: updatedReplies,
            };
          }
          return comment;
        });
        setComments(updatedComments);
        setReplyValue('');
        setSelectedCommentId(null)
      }
    }
  }

  const handleEditing = (comment) => {
    setSelectedCommentIdFOrEdit(comment.id)
    setEditValue(comment.content)
  }

  const handleEditingReply = (reply) => {
    setSelectedReplyIdFOrEdit(reply.id)
    setEditValue(reply.content)
  }

  const saveReplyAfterEdit = (comment, id) => {
    const updatedReply = comment.replies.map((reply) => {
      if (reply.id == id) {
        return {
          ...reply,
          content: editValue
        }
      }
      return reply
    })

    const updatedComment = comments.map((comment) => {
      if (comment.id == parseInt(id)) {
        return {
          ...comment,
          replies: updatedReply
        }
      }
      return comment
    })
    setComments(updatedComment)
    setSelectedReplyIdFOrEdit(null)
  }

  const saveAfterEdit = (id) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id == id) {
        return {
          ...comment,
          content: editValue
        }
      }
      return comment
    })
    setComments(updatedComments)
    setSelectedCommentIdFOrEdit(null)
  }

  return (
    <>
      <div className='main-container'>

        {comments.map((comment) => {
          return (
            <>
              <div className='received-msg'>
                <div className='score-count'>
                <img src='images/icon-minus.svg' className='minus-img' onClick={() => onDecrement(comment.id)} />
                  <p>{comment.score}</p>
                  <img src='images/icon-plus.svg' className='plus-img' onClick={() => onIcrement(comment.id)} />
                </div>
                <div className='user-content'>
                  <div className='user-content-header'>
                    <div className='user-msg-info'>
                      <img className='user-img' src={comment.user.image.png} />
                      <p className='user-name'>{comment.user.username}</p>
                      {comment.user.username == 'juliusomo' ?
                        <p id='youBtn'>you</p>
                        :
                        ''}
                      <p className='msg-time gray-text'>{comment.createdAt}</p>
                    </div>
                    {comment.user.username == 'juliusomo' ?
                      <div className='btn-conatiner'>
                        <div className='delete-btn' onClick={() => {
                          showDeleteConfirmation(comment.id)
                        }}>
                          <img src='images/icon-delete.svg' />
                          <p>Delete</p>
                        </div>
                        <div className='edit-btn' onClick={() => handleEditing(comment)}>
                          <img src='images/icon-edit.svg' />
                          <p>Edit</p>
                        </div>
                      </div>
                      :
                      < div className='reply-btn' onClick={() => handleReplying(comment.id)}>
                        <img src='images/icon-reply.svg' />
                        <p>Reply</p>
                      </div>
                    }
                  </div>
                  <div className='msg-content'>
                    {
                      selectedCommentIdFOrEdit == comment.id ? (
                        <>
                          <textarea rows={4} value={editValue} onChange={(e) => setEditValue(e.target.value)} className='gray-text'></textarea>
                          <button className='save-btn' onClick={() => saveAfterEdit(comment.id)}>Save</button>
                        </>
                      ) : (
                        <p className='gray-text'>{comment.content}</p>
                      )
                    }
                  </div>
                </div>
              </div>

              {selectedCommentId === comment.id && <ReplyComments currentUser={data.currentUser} replyValue={replyValue} setReplyValue={setReplyValue} sendReply={sendReply} />}

              {
                comment.replies && comment.replies.length !== 0 &&
                < div className='sent-msg-container'>
                  <div className='line-content'></div>
                  <div className='sent-msg-box'>
                    {
                      comment && comment.replies && comment.replies.map((reply, index) => {
                        if (reply && reply.user) {
                          return (
                            <>
                              <div className='sent-msg' key={index}>

                                <div className='score-count'>
                                <img src='images/icon-minus.svg' className='minus-img' onClick={() => onDecrement(reply.id)} />
                                  <p>{reply.score}</p>
                                  <img src='images/icon-plus.svg' className='plus-img' onClick={() => onIcrement(reply.id)} />
                                </div>
                                <div className='user-content'>
                                  <div className='user-content-header'>
                                    <div className='user-msg-info'>
                                      <img className='user-img' src={reply.user.image.png || ''} />
                                      <p className='user-name'>{reply.user.username}</p>
                                      {reply.user.username == 'juliusomo' ?
                                        <p id='youBtn'>you</p>
                                        :
                                        ''}
                                      <p className='msg-time gray-text'>{reply.createdAt}</p>
                                    </div>
                                    {reply.user.username == 'juliusomo' ?
                                      <div className='btn-conatiner'>
                                        <div className='delete-btn' onClick={() => deleteReply(comment.id, reply.id)}>
                                          <img src='images/icon-delete.svg' />
                                          <p>Delete</p>
                                        </div>
                                        <div className='edit-btn' onClick={() => handleEditingReply(reply)}>
                                          <img src='images/icon-edit.svg' />
                                          <p>Edit</p>
                                        </div>
                                      </div>
                                      :
                                      <div className='reply-btn' onClick={() => handleReplying(reply.id)}>
                                        <img src='images/icon-reply.svg' />
                                        <p>Reply</p>
                                      </div>
                                    }
                                  </div>
                                  <div className='msg-content'>
                                    {
                                      selectedReplyIdFOrEdit == reply.id ? (
                                        <>
                                          <textarea rows={4} value={editValue} onChange={(e) => setEditValue(e.target.value)} className='gray-text'></textarea>
                                          <button className='save-btn' onClick={() => saveReplyAfterEdit(comment, reply.id)}>Save</button>
                                        </>
                                      ) : (
                                        <p className='gray-text'><span className='reply-to'>@{reply.replyingTo} </span>{reply.content}</p>
                                      )
                                    }
                                  </div>
                                </div>
                              </div >

                              {selectedCommentId === reply.id && <ReplyComments currentUser={data.currentUser} replyValue={replyValue} setReplyValue={setReplyValue} sendReply={sendReply} />}

                              {
                                reply && reply.replies && reply.replies.map((reply) => {
                                  return (
                                    <>
                                      <div className='sent-msg' key={index}>

                                        <div className='score-count'>
                                        <img src='images/icon-minus.svg' onClick={() => onDecrement()} />
                                          <p>{reply.score}</p>
                                          <img src='images/icon-plus.svg' onClick={() => onIcrement()} />
                                        </div>
                                        <div className='user-content'>
                                          <div className='user-content-header'>
                                            <div className='user-msg-info'>
                                              <img className='user-img' src={reply.user.image.png || ''} />
                                              <p className='user-name'>{reply.user.username}</p>
                                              {reply.user.username == 'juliusomo' ?
                                                <p id='youBtn'>you</p>
                                                :
                                                ''}
                                              <p className='msg-time gray-text'>{reply.createdAt}</p>
                                            </div>
                                            {reply.user.username == 'juliusomo' ?
                                              <div className='btn-conatiner'>
                                                <div className='delete-btn' >
                                                  <img src='images/icon-delete.svg' />
                                                  <p>Delete{reply.id}</p>
                                                </div>
                                                <div className='edit-btn'>
                                                  <img src='images/icon-edit.svg' />
                                                  <p>Edit</p>
                                                </div>
                                              </div>
                                              :
                                              <div className='reply-btn'  >
                                                <img src='images/icon-reply.svg' />
                                                <p>Reply</p>
                                              </div>
                                            }
                                          </div>
                                          <div className='msg-content'>
                                            <p className='gray-text'><span className='reply-to'>@{reply.replyingTo} </span>{reply.content}</p>
                                          </div>
                                        </div>
                                      </div >
                                    </>
                                  )
                                })
                              }
                            </>
                          )
                        }
                        return null
                      })
                    }
                  </div >
                </div >
              }
            </>
          )
        })}

        <AddComments currentUser={data.currentUser} addComments={addComments} commentValue={commentValue} setCommentValue={setCommentValue} />

      </div >

      {
        displayDeleteBox && <DeleteComments setDisplayDeleteBOx={setDisplayDeleteBOx} deleteComment={deleteComment} deleteCommentId={deleteCommentId} />
      }
    </>
  )
}
export default Comments;