import { useReducer } from 'react';

const ERROR_EVENTS = {
	ERROR_PHONE: 'ERROR_PHONE',
	ERROR_EMAIL: 'ERROR_EMAIL',
	ERROR_RESET: 'ERROR_RESET',
	ERROR_RESPONSE: 'ERROR_RESPONSE',
};

const errorReducer = (state, action) => {
	switch (action.type) {
		case ERROR_EVENTS.ERROR_PHONE:
			return {
				...state,
				phoneError: 'A valid phone number is required!',
			};
		case ERROR_EVENTS.ERROR_EMAIL:
			return {
				...state,
				emailError: 'A valid e-mail address is required!',
			};
		case ERROR_EVENTS.ERROR_RESPONSE:
			return {
				...state,
				loginError: action.errorMessage,
			};
		case ERROR_EVENTS.ERROR_RESET:
			return {
				emailError: false,
				phoneError: false,
				loginError: false,
			};
		default:
			return state;
	}
};

export const useErrorReducer = () => {
	const [errorsState, dispatchError] = useReducer(errorReducer, {
		emailError: false,
		phoneError: false,
		loginError: false,
	});

	return { errorsState, dispatchError, errorEvents: ERROR_EVENTS };
};
