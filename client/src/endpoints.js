const BASE_URL = 'http://78.130.163.35:3001'

export default {
    LOGIN: `${BASE_URL}/login`,
    VERIFY: `${BASE_URL}/verify`,
    LOGIN_HISTORY: `${BASE_URL}/login-entries`,
    GET_USER_DATA : (id) => `${BASE_URL}/${id}`
}
