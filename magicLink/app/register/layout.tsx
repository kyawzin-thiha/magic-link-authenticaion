import './register.scss';

export const metadata = {
	title: 'Register',
	description: 'Register for an account.',
};


export default async function RegisterLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="register-container">{children}</div>;
}
