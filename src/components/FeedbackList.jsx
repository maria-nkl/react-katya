import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeedbacks, deleteFeedback } from '../redux/feedbackSlice';

const FeedbackList = () => {
  const dispatch = useDispatch();
  const { items: feedbacks, loading, error } = useSelector(state => state.feedbacks);
  const { currentUser } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchFeedbacks());
  }, [dispatch]);

  const handleDelete = async (id, userId) => {
    if (currentUser && (currentUser.id === userId || currentUser.isAdmin)) {
      if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
        await dispatch(deleteFeedback(id));
      }
    }
  };

  if (loading) return <div>Загрузка отзывов...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="feedback-list-container">
      <h2 className="feedback-list-title">История отзывов</h2>
      {feedbacks.length === 0 ? (
        <p className="no-feedbacks">Пока нет отзывов</p>
      ) : (
        <div className="feedback-list">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="feedback-item">
              <div className="feedback-header">
                <h3 className="feedback-author">{feedback.author}</h3>
                <span className="feedback-date">
                  {new Date(feedback.date).toLocaleString()}
                </span>
              </div>
              <h4 className="feedback-title">{feedback.title}</h4>
              <p className="feedback-text">{feedback.message}</p>
              {currentUser && (currentUser.id === feedback.userId || currentUser.isAdmin) && (
                <button
                  className="feedback-delete-btn"
                  onClick={() => handleDelete(feedback.id, feedback.userId)}
                >
                  Удалить
                </button>
              )}
              <div className="feedback-divider"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;