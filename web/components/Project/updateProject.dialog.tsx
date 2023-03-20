'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SaveIcon from '@mui/icons-material/Save';
import Alert from '@mui/material/Alert';

const updateProfile = async (
	id: string,
	name: string,
	description: string,
	hostUrl: string,
	successUrl: string,
) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API}/project/update/${id}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name, description, hostUrl, successUrl }),
			mode: 'cors',
			credentials: 'include',
		},
	);
	if (response.ok) {
		return [true, ''];
	} else {
		const error = await response.json();
		return [false, error.message];
	}
};

type projectProp = {
	id: string;
	name: string;
	description: string;
	credentials: {
		hostUrl: string;
		successUrl: string;
	};
};

export default function UpdateProjectDialog({
	isOpen,
	onClose,
	project,
}: {
	isOpen: boolean;
	onClose: () => void;
	project: projectProp;
}) {
	const router = useRouter();

	const [isPending, startTransition] = useTransition();

	const [projectData, setProjectData] = useState({
		name: project.name,
		description: project.description,
		hostUrl: project.credentials.hostUrl,
		successUrl: project.credentials.successUrl,
	});

	const [systemData, setSystemData] = useState({
		isLoading: false,
		isError: false,
		errorMessage: '',
		passwordError: false,
	});

	const handleClose = () => {
		if (!systemData.isLoading) {
			clearProjectData();
			handleSystemData().clearError();
			onClose();
		}
	};

	const handleProjectData = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProjectData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const clearProjectData = () => {
		setProjectData({
			name: '',
			description: '',
			hostUrl: '',
			successUrl: '',
		});
	};

	const handleSystemData = () => {
		return {
			setError: (errorMessage: string) =>
				setSystemData((prev) => ({
					...prev,
					isError: true,
					errorMessage,
				})),
			clearError: () =>
				setSystemData((prev) => ({
					...prev,
					isError: false,
					passwordError: false,
					errorMessage: '',
				})),
			handleLoadingStatus: (isLoading: boolean) =>
				setSystemData((prev) => ({
					...prev,
					isLoading,
				})),
		};
	};

	const onSubmit = async () => {
		handleSystemData().clearError();
		handleSystemData().handleLoadingStatus(true);
		const [isSuccess, error] = await updateProfile(
			project.id,
			projectData.name,
			projectData.description,
			projectData.hostUrl,
			projectData.successUrl,
		);
		handleSystemData().handleLoadingStatus(false);

		if (isSuccess) {
			onClose();
			startTransition(() => {
				router.refresh();
			});
		} else {
			handleSystemData().setError(error);
		}
	};
	return (
		<Dialog
			open={isOpen}
			onClose={handleClose}
		>
			<DialogTitle>Update Profile Info</DialogTitle>
			<DialogContent>
				<div className="input-container">
					<TextField
						id="standard-basic"
						label="Name"
						name="name"
						variant="standard"
						fullWidth
						sx={{ my: 1.5 }}
						value={projectData.name}
						onChange={handleProjectData}
						disabled={systemData.isLoading}
					/>
					<TextField
						id="standard-basic"
						label="Description"
						name="description"
						variant="standard"
						fullWidth
						multiline
						inputProps={{ maxLength: 100 }}
						rows={3}
						sx={{ my: 1.5 }}
						value={projectData.description}
						onChange={handleProjectData}
						disabled={systemData.isLoading}
					/>
					<TextField
						id="standard-basic"
						label="Host URL"
						name="hostUrl"
						variant="standard"
						fullWidth
						sx={{ my: 1.5 }}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">https://</InputAdornment>
							),
						}}
						value={projectData.hostUrl}
						onChange={handleProjectData}
						disabled={systemData.isLoading}
					/>
					<TextField
						id="standard-basic"
						label="Success URL"
						name="successUrl"
						variant="standard"
						fullWidth
						sx={{ my: 1.5 }}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">https://</InputAdornment>
							),
						}}
						value={projectData.successUrl}
						onChange={handleProjectData}
						disabled={systemData.isLoading}
					/>
				</div>
								{systemData.isError && (
					<Alert
						severity="error"
						sx={{ my: 1.5, width: '100%' }}
					>
						{systemData.errorMessage}
					</Alert>
				)}
			</DialogContent>
			<DialogActions>
				<Button
					onClick={handleClose}
					disabled={systemData.isLoading}
				>
					Cancel
				</Button>
				<LoadingButton
					loading={systemData.isLoading}
					loadingPosition="start"
					variant="text"
					disableElevation
					disabled={systemData.isLoading }
					startIcon={<SaveIcon />}
					onClick={onSubmit}
					sx={{
						my: 1,
					}}
				>
					Save
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}
