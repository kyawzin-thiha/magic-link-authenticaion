import './verifyEmail.scss';

export const metadata = {
	title: 'Complete your login process',
}

export default function CompleteLoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className='verify_email-container'>{children}</div>;
}
