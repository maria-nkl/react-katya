import { createSlice } from '@reduxjs/toolkit';

// Функция для загрузки пользователей из localStorage
const loadUsersFromLocalStorage = () => {
  const users = localStorage.getItem('registeredUsers');
  return users ? JSON.parse(users) : [];
};

// Определение начального состояния
const initialState = {
  isAuthenticated: false,
  currentUser: null,
  registeredUsers: loadUsersFromLocalStorage(),
  isLoading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      const newUser = action.payload;
      const userExists = state.registeredUsers.some(
        user => user.email === newUser.email
      );

      if (!userExists) {
        state.registeredUsers.push(newUser);
        state.currentUser = newUser;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('registeredUsers', JSON.stringify(state.registeredUsers));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
      } else {
        state.error = 'Пользователь с таким email уже существует';
      }
    },
    loginUser: (state, action) => {
      const { email, password } = action.payload;
      const user = state.registeredUsers.find(
        user => user.email === email && user.password === password
      );

      if (user) {
        state.currentUser = user;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        state.error = 'Неверный email или пароль';
      }
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('currentUser');
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

// Исправлен экспорт действий - должны совпадать с именами в reducers
export const { registerUser, loginUser, logoutUser, setLoading, clearError } = authSlice.actions;
export default authSlice.reducer;