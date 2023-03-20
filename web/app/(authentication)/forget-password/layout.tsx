import './forgetPassword.scss';

export const metadata = {
	title: 'Request Password Reset',
}

export default function ForgetPasswordLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className='forget_password-container'>{children}</div>;
}
