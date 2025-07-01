export const notificationReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data;
    case 'CLEAR_NOTIFICATION':
      return '';
    default:
      return state;
  }
}

export const setNotification = (notification) => {
    return {
        type: 'SET_NOTIFICATION',
        data: { notification }
    }
}

export default notificationReducer 