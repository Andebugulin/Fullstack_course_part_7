import React, { createContext, useContext, useReducer } from 'react';

const initialState = null;

const LOGOUT_USER = 'LOGOUT_USER';
const LOGIN_USER = 'LOGIN_USER';

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_USER:
            return action.payload.user;
        case LOGOUT_USER:
            return initialState;
        default:
            return state;
    }
}

const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
    const [user, dispatch] = useReducer(userReducer, initialState);

    const loginUser = (user, token) => {
        dispatch({
            type: LOGIN_USER,
            payload: { user: { ...user, token } }, // Include token in user object
          });
    }

    const logoutUser = () => {
        dispatch({ type: LOGOUT_USER });
    }

    return (
        <UserContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}

