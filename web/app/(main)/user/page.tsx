import Profile from '@/components/Profile';
import { cookies } from 'next/headers';

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
	} else {
		return null;
	}
};

export default async function UserPage() {
	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value as string;
	const userData = await getUserData(token);

	return (
		<div className="user-data-container">
			<Profile userData={userData} />
		</div>
	);
}
