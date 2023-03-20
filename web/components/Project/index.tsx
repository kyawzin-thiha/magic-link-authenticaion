'use client';

import { useState } from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import NoSSR from '@mui/material/NoSsr';
import Box from '@mui/material/Box';
import MuiTabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import DeleteProjectDialog from './deleteProject.dialog';
import CredentialsDialog from './credentials.dialog';
import UpdateProjectDialog from './updateProject.dialog';
import CollectionList from './Collection/list';
import CollectionsTab from './Collection';
import BlacklistsTab from './Blacklist';

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
	collections: collectionProp[];
	blacklists: blacklistProp[];
};

type collectionProp = {
	id: string;
	username: string;
	email: string;
	isActive: boolean;
	createdAt: string;
};

type blacklistProp = {
	id: string;
	email: string;
	isActive: boolean;
	createdAt: string;
};

export default function Project({ project }: { project: projectProp }) {
	const [isCredentialsDialogOpen, setIsCredentialsDialogOpen] = useState(false);

	const [isDeleteProjectDialogOpen, setIsDeleteProjectDialogOpen] =
		useState(false);

	const [isUpdateProjectDialogOpen, setIsUpdateProjectDialogOpen] =
		useState(false);

	const handleCredentialsDialog = () => {
		setIsCredentialsDialogOpen((prev) => !prev);
	};

	const handleDeleteProject = () => {
		setIsDeleteProjectDialogOpen((prev) => !prev);
	};

	const handleUpdateProject = () => {
		setIsUpdateProjectDialogOpen((prev) => !prev);
	};

	return (
		<>
			<Stack
				spacing={5}
				sx={{ my: { sm: 2, md: 5 } }}
			>
				<Stack spacing={3}>
					<Stack>
						<Stack
							direction="row"
							alignItems="center"
							justifyContent="space-between"
						>
							<Typography
								color="text.secondary"
								sx={{
									typography: { sm: 'body1', md: 'h4' },
									fontWeight: 'bolder',
								}}
							>
								{project.name}
							</Typography>
							<Stack
								direction="row"
								spacing={2}
							>
								<Tooltip title="View Credentials">
									<IconButton
										color="info"
										onClick={handleCredentialsDialog}
									>
										<WysiwygIcon />
									</IconButton>
								</Tooltip>
								<Tooltip title="Edit Project Info">
									<IconButton
										color="warning"
										onClick={handleUpdateProject}
									>
										<BorderColorIcon />
									</IconButton>
								</Tooltip>
								<Tooltip title="Delete">
									<IconButton
										color="error"
										onClick={handleDeleteProject}
									>
										<DeleteIcon />
									</IconButton>
								</Tooltip>
							</Stack>
						</Stack>
						<Typography
							variant="caption"
							color="text.secondary"
						>
							@{project.uniqueName}
						</Typography>
					</Stack>
					<Typography
						color="text.secondary"
						sx={{ typography: { sm: 'body2', md: 'body1' } }}
					>
						{project.description}
					</Typography>
				</Stack>
				<Stack>
					<Tabs
						collections={project.collections}
						blacklists={project.blacklists}
						projectId={project.id}
					/>
				</Stack>
			</Stack>
			<DeleteProjectDialog
				isOpen={isDeleteProjectDialogOpen}
				onClose={handleDeleteProject}
				projectId={project.id}
			/>
			<CredentialsDialog
				isOpen={isCredentialsDialogOpen}
				onClose={handleCredentialsDialog}
				projectCredential={project.credentials}
				projectCount={{
					collections: project.collections.length,
					blacklists: project.blacklists.length,
				}}
			/>
			{isUpdateProjectDialogOpen && (
				<UpdateProjectDialog
					isOpen={isUpdateProjectDialogOpen}
					onClose={handleUpdateProject}
					project={project}
				/>
			)}
		</>
	);
}

function a11yProps(index: number) {
	return {
		id: `tab-${index}`,
		'aria-controls': `tabpanel-${index}`,
	};
}

function Tabs({
	collections,
	blacklists,
	projectId,
}: {
	collections: collectionProp[];
	blacklists: blacklistProp[];
	projectId: string;
}) {
	const [value, setValue] = useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<NoSSR>
			<Box sx={{ width: '100%' }}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<MuiTabs
						value={value}
						onChange={handleChange}
						aria-label="Collections and Blacklists Tab"
					>
						<Tab
							label="Collections"
							{...a11yProps(0)}
						/>
						<Tab
							label="Blacklist"
							{...a11yProps(1)}
						/>
					</MuiTabs>
				</Box>
				<CollectionsTab
					collections={collections}
					value={value}
					index={0}
				/>
				<BlacklistsTab
					blacklists={blacklists}
					value={value}
					index={1}
					projectId={projectId}
				/>
			</Box>
		</NoSSR>
	);
}
