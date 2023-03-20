import Project from '@/components/Project';
import { cookies } from 'next/headers';

const getProject = async (uniqueName: string, cookie: string) => {
	const response = await fetch(`${process.env.API}/project/get/${uniqueName}`, {
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
		return null;
	}
};

export default async function ProjectPage({
	params,
}: {
	params: { uniqueName: string };
}) {
	const cookieStore = cookies();
	const token = cookieStore.get('token')?.value as string;

	const project = await getProject(params.uniqueName, token);

	return <Project project={project} />;
}
