import { cookies } from 'next/headers';
import './globals.scss';
import { redirect } from 'next/navigation';
import NavBar from '@/components/NavBar';

export const metadata = {
	title: 'Centralized Email Authentication System',
	description:
		'A centralized email authentication system for your application. Easy to integrate and use.',
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

const getUserData = async (cookie: string) => {
	const response = await fetch(`${process.env.API}/user`, {
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
		return await response.json();
	}
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value as string;

	const isAuthenticated = await reAuthenticate(token);

	if (!isAuthenticated) {
		redirect('/login');
	}

	const data = await getUserData(token);

	return (
		<html lang="en">
			<head />
			<body>
				<nav>
					<NavBar
						avatar={data.avatar}
						name={data.name}
					/>
				</nav>
				<div className="root-container">{children}</div>
			</body>
		</html>
	);
}
