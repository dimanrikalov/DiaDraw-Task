const BASE_URL = 'http://78.130.163.35:3001'; //http://localhost:3001 for the final commit

const ENDPOINTS = {
	LOGIN: `${BASE_URL}/auth/login`,
	VERIFY: `${BASE_URL}/auth/verify`,
	REGISTER: `${BASE_URL}/auth/register`,
	RESET_CODE: `${BASE_URL}/auth/reset-code`,
	LOGIN_HISTORY: `${BASE_URL}/login-entries`,
	GET_USER_DATA: (id) => `${this.LOGIN_HISTORY}/${id}`,
};

export default ENDPOINTS;