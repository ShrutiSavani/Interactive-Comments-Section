import React from 'react'

const DeleteComments = ({ setDisplayDeleteBOx, deleteComment, deleteCommentId }) => {
    return (
        <>
            <div className='overlay' id='overlay'></div>
            <div className='delete-box-container modal'>
                <div>
                    <h2>Delete comment</h2>
                    <p className='gray'>Are you sure you want to delete this comment? This will remove the comment and can't be undone.</p>
                </div>
                <div className='buttons'>
                    <button className='nocancle' onClick={() => setDisplayDeleteBOx(false)}>NO, CANCLE</button>
                    <button className='yesdelete' onClick={() => {
                        deleteComment(deleteCommentId)
                        setDisplayDeleteBOx(false)
                    }}>YES, DELETE</button>
                </div>
            </div>
        </>
    )
}

export default DeleteComments