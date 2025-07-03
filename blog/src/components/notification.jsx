import React from 'react'
import { useNotification } from '../contexts/notificationContext'

const Notification = () => {
  const { notification, hideNotification } = useNotification()

  if (!notification.visible) {
    return null
  }

  const getNotificationStyle = (type) => {
    const baseStyle = {
      padding: '10px',
      margin: '10px 0',
      borderRadius: '4px',
      border: '1px solid',
      position: 'relative',
      cursor: 'pointer'
    }

    switch (type) {
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: '#f2dede',
          borderColor: '#ebccd1',
          color: '#a94442'
        }
      case 'info':
        return {
          ...baseStyle,
          backgroundColor: '#d9edf7',
          borderColor: '#bce8f1',
          color: '#31708f'
        }
      default: 
        return {
          ...baseStyle,
          backgroundColor: '#dff0d8',
          borderColor: '#d6e9c6',
          color: '#3c763d'
        }
    }
  }

  return (
    <div 
      style={getNotificationStyle(notification.type)}
      onClick={hideNotification}
    >
      {notification.message}
      <span 
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontWeight: 'bold',
          fontSize: '16px'
        }}
      >
        ×
      </span>
    </div>
  )
}

export default Notification