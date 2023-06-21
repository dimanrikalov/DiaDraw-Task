const BASE_URL = 'http://localhost:3001';

const ENDPOINTS = {
	LOGIN: `${BASE_URL}/auth/login`,
	VERIFY: `${BASE_URL}/auth/verify`,
	REGISTER: `${BASE_URL}/auth/register`,
	RESET_CODE: `${BASE_URL}/auth/reset-code`,
	LOGIN_HISTORY: `${BASE_URL}/login-entries`,
	GET_USER_DATA: (id) => `${this.LOGIN_HISTORY}/${id}`,
	GET_TIMEOUT_DURATION: `${BASE_URL}/auth/timeout-remaining`
};

export default ENDPOINTS;