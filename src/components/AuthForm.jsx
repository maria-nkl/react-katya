// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { useDispatch } from 'react-redux';
// import { registerUser, loginUser } from '../redux/authSlice';

// const AuthForm = ({ isLogin, onSuccess }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch // Добавляем watch в деструктуризацию
//   } = useForm();

//   const dispatch = useDispatch();

//   const onSubmit = (data) => {
//     if (isLogin) {
//       dispatch(loginUser(data));
//     } else {
//       dispatch(registerUser(data));
//     }
//     reset();
//     onSuccess();
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
//       {!isLogin && (
//         <div className="form-group">
//           <label>Имя</label>
//           <input
//             {...register('name', { required: 'Обязательное поле' })}
//             className="form-input"
//           />
//           {errors.name && <span className="error">{errors.name.message}</span>}
//         </div>
//       )}

//       <div className="form-group">
//         <label>Email</label>
//         <input
//           type="email"
//           {...register('email', {
//             required: 'Обязательное поле',
//             pattern: {
//               value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//               message: 'Некорректный email'
//             }
//           })}
//           className="form-input"
//         />
//         {errors.email && <span className="error">{errors.email.message}</span>}
//       </div>

//       <div className="form-group">
//         <label>Пароль</label>
//         <input
//           type="password"
//           {...register('password', {
//             required: 'Обязательное поле',
//             minLength: {
//               value: 6,
//               message: 'Минимум 6 символов'
//             }
//           })}
//           className="form-input"
//         />
//         {errors.password && <span className="error">{errors.password.message}</span>}
//       </div>

//       {!isLogin && (
//         <div className="form-group">
//           <label>Подтвердите пароль</label>
//           <input
//             type="password"
//             {...register('confirmPassword', {
//               validate: value =>
//                 value === watch('password') || 'Пароли не совпадают'
//             })}
//             className="form-input"
//           />
//           {errors.confirmPassword && (
//             <span className="error">{errors.confirmPassword.message}</span>
//           )}
//         </div>
//       )}

//       <button type="submit" className="submit-btn">
//         {isLogin ? 'Войти' : 'Зарегистрироваться'}
//       </button>
//     </form>
//   );
// };

// export default AuthForm;


import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginUser } from '../redux/authSlice';

const AuthForm = ({ isLogin, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.auth);
  const [authError, setAuthError] = useState(null);

  const onSubmit = async (data) => {
    setAuthError(null);
    try {
      if (isLogin) {
        await dispatch(loginUser(data));
      } else {
        await dispatch(registerUser(data));
      }
      
      // Проверяем, прошла ли аутентификация
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user) {
        reset();
        onSuccess();
      } else {
        setAuthError(isLogin 
          ? 'Неверный email или пароль' 
          : 'Пользователь с таким email уже существует');
      }
    } catch (error) {
      setAuthError('Произошла ошибка при авторизации');
      console.error('Auth error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      {!isLogin && (
        <div className="form-group">
          <label>Имя</label>
          <input
            {...register('name', { required: 'Обязательное поле' })}
            className="form-input"
          />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>
      )}

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          {...register('email', {
            required: 'Обязательное поле',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Некорректный email'
            }
          })}
          className="form-input"
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label>Пароль</label>
        <input
          type="password"
          {...register('password', {
            required: 'Обязательное поле',
            minLength: {
              value: 6,
              message: 'Минимум 6 символов'
            }
          })}
          className="form-input"
        />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>

      {!isLogin && (
        <div className="form-group">
          <label>Подтвердите пароль</label>
          <input
            type="password"
            {...register('confirmPassword', {
              validate: value =>
                value === watch('password') || 'Пароли не совпадают'
            })}
            className="form-input"
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword.message}</span>
          )}
        </div>
      )}

      {authError && <div className="error-message">{authError}</div>}
      
      <button 
        type="submit" 
        className="submit-btn"
        disabled={isLoading}
      >
        {isLoading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
      </button>
    </form>
  );
};

export default AuthForm;