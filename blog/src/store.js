import { createStore } from 'redux';
import notificationReducer from './reducers/notificationReducer';

const store = createStore(notificationReducer);

export default store;