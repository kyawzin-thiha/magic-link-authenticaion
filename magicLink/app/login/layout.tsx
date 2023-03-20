import './login.scss';

export const metadata = {
	title: 'Login',
	description: 'Login to your account.',
};

export default async function LoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {

	return <div className="login-container">{children}</div>;
}
