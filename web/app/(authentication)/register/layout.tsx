import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import './register.scss';

export const metadata = {
	title: 'Register',
	description: 'Register for an account.',
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
		cache: 'no-cache',
	});
	if (response.ok) {
		return true;
	} else {
		return false;
	}
};

export default async function RegisterLayout({
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

	return <div className="register-container">{children}</div>;
}
