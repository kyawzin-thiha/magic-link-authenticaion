import ProjectsList from '@/components/Project/list';
import { cookies } from 'next/headers';

const getAllProjects = async (cookie: string) => {
	const response = await fetch(`${process.env.API}/project/get-all`, {
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
		const data = await response.json();
		return data;
	} else {
		return [];
	}
};

export default async function LandingPage() {
	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value as string;

	const projects = await getAllProjects(token);

	return (
		<div>
			<ProjectsList projects={projects} />
		</div>
	);
}
