const AddComments = ({ currentUser, addComments, commentValue, setCommentValue }) => {

    return (
        <>
            <div className='comment-box'>
                <img className='user-img' src={currentUser.image.png} />
                <textarea className='comment-content' rows='4' value={commentValue} onChange={(e) => setCommentValue(e.target.value)} placeholder='Add a comment...'></textarea>
                <button id='sendBtn' onClick={addComments}>SEND</button>
            </div>
        </>
    )
}
export default AddComments  