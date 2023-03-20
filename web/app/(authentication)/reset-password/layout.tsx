import './resetPassword.scss';

export const metadata = {
	title: 'Reset Password',
}

export default function ResetPasswordLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className='reset_password-container'>{children}</div>;
}
