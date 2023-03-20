'use client';

import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Link from '@mui/material/Link';
import NoSSR from '@mui/material/NoSsr';
import Moment from 'react-moment';
import NewProjectDialog from './newProject';
import DeleteProjectDialog from './deleteProject.dialog';
import CredentialsDialog from './credentials.dialog';

type projectProp = {
	id: string;
	name: string;
	uniqueName: string;
	description: string;
	createdAt: string;
	credentials: {
		uniqueKey: string;
		hostUrl: string;
		successUrl: string;
	};
	_count: {
		collections: number;
		blacklists: number;
	};
};

export default function ProjectsList({
	projects,
}: {
	projects: projectProp[];
}) {
	const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);

	const handleCreateNewProject = () => {
		setIsNewProjectDialogOpen((prev) => !prev);
	};

	return (
		<NoSSR>
			<Stack spacing={3}>
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
				>
					<Typography variant="h4">Projects</Typography>
					<Button
						variant="contained"
						disableElevation
						size="small"
						onClick={handleCreateNewProject}
						sx={{
							background: '#9BDD92',
							':hover': { background: '#B8E7B1' },
							px: 2,
							py: 1,
						}}
					>
						Create New
					</Button>
				</Stack>
				<Stack>
					<TableContainer
						component={Paper}
						sx={{
							boxShadow: 'none',
							background: 'transparent',
						}}
					>
						<Table
							sx={{
								minWidth: 650,
							}}
							aria-label="simple table"
						>
							<TableHead>
								<TableRow>
									<TableCell align="center">
										<Typography
											color="text.secondary"
											variant="body1"
											sx={{ fontWeight: 'bolder' }}
										>
											Name
										</Typography>
									</TableCell>
									<TableCell align="center">
										<Typography
											color="text.secondary"
											variant="body1"
											sx={{ fontWeight: 'bolder' }}
										>
											Host URL
										</Typography>
									</TableCell>
									<TableCell align="center">
										<Typography
											color="text.secondary"
											variant="body1"
											sx={{ fontWeight: 'bolder' }}
										>
											Users
										</Typography>
									</TableCell>
									<TableCell align="center">
										<Typography
											color="text.secondary"
											variant="body1"
											sx={{ fontWeight: 'bolder' }}
										>
											Created At
										</Typography>
									</TableCell>
									<TableCell align="center">
										<Typography
											color="text.secondary"
											variant="body1"
											sx={{ fontWeight: 'bolder' }}
										>
											Actions
										</Typography>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{projects.map((project) => (
									<ProjectInfo
										project={project}
										key={project.id}
									/>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Stack>
			</Stack>
			<NewProjectDialog
				isOpen={isNewProjectDialogOpen}
				onClose={handleCreateNewProject}
			/>
		</NoSSR>
	);
}

function ProjectInfo({ project }: { project: projectProp }) {
	const [isDeleteProjectDialogOpen, setIsDeleteProjectDialogOpen] =
		useState(false);

	const [isCredentialsDialogOpen, setIsCredentialsDialogOpen] = useState(false);

	const handleDeleteProject = () => {
		setIsDeleteProjectDialogOpen((prev) => !prev);
	};

	const handleCredentialsDialog = () => {
		setIsCredentialsDialogOpen((prev) => !prev);
	};

	return (
		<>
			<TableRow
				sx={{
					height: 30,
					'&:last-child td, &:last-child th': { border: 0 },
				}}
			>
				<TableCell align="center">
					<Link href={`/${project.uniqueName}`}>
						<Typography variant="body2">{project.name}</Typography>
					</Link>
				</TableCell>
				<TableCell align="center">
					<Typography variant="body2">{project.credentials.hostUrl}</Typography>
				</TableCell>
				<TableCell align="center">
					<Typography variant="body2">{project._count.collections}</Typography>
				</TableCell>
				<TableCell align="center">
					<Typography variant="body2">
						<Moment
							format="D MMM YYYY"
							withTitle
						>
							{project.createdAt}
						</Moment>
					</Typography>
				</TableCell>
				<TableCell align="center">
					<Typography variant="body2">
						<IconButton
							onClick={handleCredentialsDialog}
							sx={{ mx: 1 }}
						>
							<MoreHorizIcon />
						</IconButton>
						<IconButton
							color="error"
							onClick={handleDeleteProject}
							sx={{ mx: 1 }}
						>
							<DeleteIcon />
						</IconButton>
					</Typography>
				</TableCell>
			</TableRow>
			<DeleteProjectDialog
				isOpen={isDeleteProjectDialogOpen}
				onClose={handleDeleteProject}
				projectId={project.id}
			/>
			<CredentialsDialog
				isOpen={isCredentialsDialogOpen}
				onClose={handleCredentialsDialog}
				projectCredential={project.credentials}
				projectCount={project._count}
			/>
		</>
	);
}
