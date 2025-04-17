// import React, { useCallback } from 'react';
// import { useForm } from 'react-hook-form';

// const FeedbackForm = ({ addFeedback }) => {
//   const { register, handleSubmit, reset, formState: { errors } } = useForm();

//   const onSubmit = useCallback((data) => {
//     addFeedback(data);
//     reset();
//   }, [addFeedback, reset]);

//   return (
//     <div className="feedback-container">
//       <h2 className="feedback-title">Оставить отзыв</h2>
//       <form className="feedback-form" onSubmit={handleSubmit(onSubmit)}>
//         <div className="form-group">
//           <label className="form-label">Ваше имя:</label>
//           <input
//             className="form-input"
//             {...register('name', { required: 'Поле обязательно для заполнения' })}
//           />
//           {errors.name && <span className="form-error">{errors.name.message}</span>}
//         </div>
//         <div className="form-group">
//           <label className="form-label">Ваш отзыв:</label>
//           <textarea
//             className="form-input"
//             rows="4"
//             {...register('feedback', { required: 'Поле обязательно для заполнения' })}
//           />
//           {errors.feedback && <span className="form-error">{errors.feedback.message}</span>}
//         </div>
//         <button
//           type="submit"
//           className="feedback-submit-btn"
//         >
//           Отправить отзыв
//         </button>
//       </form>
//     </div>
//   );
// };

// export default FeedbackForm;


import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addFeedback } from '../redux/feedbackSlice';

const FeedbackForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.auth);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await dispatch(addFeedback({
        title: data.title,
        message: data.message,
        author: currentUser.name
      })).unwrap();
      reset();
    } catch (error) {
      setSubmitError('Ошибка при отправке отзыва');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-container">
      <h2 className="feedback-title">Оставить отзыв</h2>
      {submitError && <div className="form-error">{submitError}</div>}
      <form className="feedback-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label className="form-label">Тема:</label>
          <input
            className="form-input"
            {...register('title', { required: 'Поле обязательно для заполнения' })}
          />
          {errors.title && <span className="form-error">{errors.title.message}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Ваш отзыв:</label>
          <textarea
            className="form-input"
            rows="4"
            {...register('message', { required: 'Поле обязательно для заполнения' })}
          />
          {errors.message && <span className="form-error">{errors.message.message}</span>}
        </div>
        <button
          type="submit"
          className="feedback-submit-btn"
          disabled={isSubmitting || !currentUser}
        >
          {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;