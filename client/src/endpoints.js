const BASE_URL = 'http://localhost:3000';

export default {
    LOGIN: `${BASE_URL}/login`,
    VERIFY: `${BASE_URL}/verify`,
    LOGIN_HISTORY: `${BASE_URL}/login-entries`,
    GET_USER_DATA : (id) => `${BASE_URL}/${id}`
}
