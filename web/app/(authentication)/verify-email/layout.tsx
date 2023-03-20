import './verifyEmail.scss';

export const metadata = {
	title: 'Verify Email',
}

export default function VerifyEmailLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className='verify_email-container'>{children}</div>;
}
