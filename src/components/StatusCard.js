import React, { useState, useContext } from 'react';
import { ref, push, onValue } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import { UserContext } from '../context/UserContext';
import { Sheet } from 'react-modal-sheet';
import './StatusCard.css';

const StatusCard = ({ status, onViewProfile }) => {
    const { status: statusText, userName, createdAt, id: statusId } = status;
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const { userData } = useContext(UserContext);
    const database = getDatabase();

    const date = createdAt ? new Date(createdAt).toLocaleString() : 'Tanggal tidak tersedia';

    const toggleCommentsModal = () => {
        setIsSheetOpen(!isSheetOpen);
        if (!isSheetOpen) {
            const commentsRef = ref(database, `statuses/${statusId}/comments`);
            onValue(commentsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const commentsArray = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }));
                    setComments(commentsArray.reverse());
                } else {
                    setComments([]);
                }
            });
        }
    };

    const handleAddComment = () => {
        if (commentText.trim() === '') return;

        const newComment = {
            userName: userData.name,
            text: commentText,
            createdAt: new Date().toISOString()
        };

        const commentsRef = ref(database, `statuses/${statusId}/comments`);
        push(commentsRef, newComment);
        setCommentText('');
    };

    return (
        <div className="status-card">
            <h3>{userName}</h3>
            <p>{statusText}</p>
            <small>Created At: {date}</small>
            <button onClick={onViewProfile}>View Profile</button>
            <button className="comment-button" onClick={toggleCommentsModal}>💬</button>

            <Sheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                snapPoints={[450, 0]} // Adjust the height of the sheet modal
                initialSnap={0} // Open the sheet to the first snap point (450px)
            >
                <Sheet.Container>
                    <Sheet.Header />
                    <Sheet.Content>
                        <div className="comments-list">
                            {comments.map(comment => (
                                <div key={comment.id} className="comment">
                                    <strong>{comment.userName}</strong>
                                    <p>{comment.text}</p>
                                    <small>{new Date(comment.createdAt).toLocaleString()}</small>
                                </div>
                            ))}
                        </div>
                        {userData && (
                            <div className="add-comment">
                                <input
                                    type="text"
                                    placeholder="Write a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                                <button onClick={handleAddComment}>Add Comment</button>
                            </div>
                        )}
                    </Sheet.Content>
                </Sheet.Container>
                <Sheet.Backdrop />
            </Sheet>
        </div>
    );
};

export default StatusCard;
