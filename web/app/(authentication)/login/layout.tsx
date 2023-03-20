import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import './login.scss';

export const metadata = {
	title: 'Login',
	description: 'Login to your account.',
};

const reAuthenticate = async (cookie: string) => {
	const response = await fetch(`${process.env.API}/auth/re-authenticate`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Cookie: `token=${cookie}`,
		},
		mode: 'cors',
		credentials: 'include',
	});
	if (response.ok) {
		return true;
	} else {
		return false;
	}
};

export default async function LoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = cookies();

	const token = cookieStore.get('token')?.value;

	if (token) {
		const isAuthenticated = await reAuthenticate(token);

		if (isAuthenticated) {
			redirect('/');
		}
	}

	return <div className="login-container">{children}</div>;
}
