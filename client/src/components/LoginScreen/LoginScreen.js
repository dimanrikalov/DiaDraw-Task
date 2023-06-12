import './LoginScreen.css';
import {useReducer} from 'react';

const EVENTS = {
	EMAIL_CHANGE: 'EMAIL_CHANGE',
	PASSWORD_CHANGE: 'PASSWORD_CHANGE',
	AGREE_CHANGE: 'AGREE_CHANGE'
}

const reducer = (state, action) => {
	switch(action) {
		case EVENTS.EMAIL_CHANGE:
			break;
		case EVENTS.PASSWORD_CHANGE:
			break;
		case EVENTS.AGREE_CHANGE:
			break;
		default:
			return state;
	}
}

export const LoginScreen = () => {

	const [state, dispatch] = useReducer(reducer, {
		email: '',
		password: '',
		agree: false
	});


	return (
		<div className="container">
			<h1>Want to check out this file? Log in or sign up</h1>
			<form action="#" className="form-container">
				<input type="button" value="Continue with Google" className="google-login"/>
				<p>or</p>
				<input type="email" placeholder="Email" className="data-input"/>
                <div className="email-error"></div>
				<input type="password" placeholder="Password" className="data-input"/>
                <div className="password-error"></div>
				<div className="confirm-div">
                <input type="checkbox" id="agree" name="agree" className="extra_info--checkbox--xK3ti" value="false" />
					<label for="agree">
						I agree to join Figma's mailing list
					</label>
				</div>
				<input type="submit" value="Create account" className="create-account"/>
			</form>
			<p className="subscript">
				By clicking "Create account" or "Continue with Google", you
				agree to the <a href="#">Figma TOS</a> and <a href="#">Privacy Policy</a>.
			</p>
            <a className="sign-on" href="#">Use single sign-on</a>
            <h4 className="already-have-acc">Already have an account? <a href="#">Log in</a></h4>
		</div>
	);
};
