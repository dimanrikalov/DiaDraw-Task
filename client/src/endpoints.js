const BASE_URL = 'http://localhost:3001'
const LOGIN = 'http://localhost:3001/login';
const VERIFY = 'http://localhost:3001/verify';

export default {
    LOGIN,
    VERIFY,
    GET_USER_DATA : (id) => `${BASE_URL}/${id}`
}
