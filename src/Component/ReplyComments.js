import React from 'react'

const ReplyComments = ({ currentUser, sendReply, replyValue, setReplyValue }) => {
    return (
        <>
            <div class='comment-box'>
                <img class='user-img' src={currentUser.image.png} />
                <textarea class='comment-content' value={replyValue} onChange={(e) => setReplyValue(e.target.value)} rows='4' placeholder='repling...'></textarea>
                <button id='sendBtn' onClick={sendReply} >Reply</button>
            </div>
        </>
    )
}

export default ReplyComments