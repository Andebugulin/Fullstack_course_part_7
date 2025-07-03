import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
    message: '',
    type: 'info', 
    duration: 5000,
    visible: false, 
}

const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION'
const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION'

const notificationReducer = (state, action) => {
    switch (action.type) {
        case SHOW_NOTIFICATION:
            return {
                ...state,
                message: action.payload.message,
                type: action.payload.type || 'info',
                duration: action.payload.duration || 5000,
                visible: true,
            }
        case HIDE_NOTIFICATION:
            return initialState
        default:
            return state
    }
}

const NotificationContext = createContext(initialState);

export const NotificationProvider = ({ children }) => {
    const [notification, dispatch] = useReducer(notificationReducer, initialState);

    const showNotification = (message, type = 'info', duration = 5000) => {
        dispatch({
            type: SHOW_NOTIFICATION,
            payload: { message, type, duration },
        });

        setTimeout(() => {
            dispatch({ type: HIDE_NOTIFICATION });
        }, duration);
    }

    const hideNotification = () => {
        dispatch({ type: HIDE_NOTIFICATION });
    }

    return (
        <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}