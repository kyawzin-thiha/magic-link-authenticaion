import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';

const createProject = async (
	name: string,
	description: string,
	hostUrl: string,
	successUrl: string,
) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API}/project/create`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			mode: 'cors',
			credentials: 'include',
			body: JSON.stringify({ name, description, hostUrl, successUrl }),
		},
	);

	if (response.ok) {
		const data = await response.json();
		return [true, data];
	} else {
		const error = await response.json();
		return [false, error.message];
	}
};

export default function NewProjectDialog({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const router = useRouter();

	const [userData, setUserData] = useState({
		name: '',
		description: '',
		hostUrl: '',
		successUrl: '',
	});

	const [systemData, setSystemData] = useState({
		isLoading: false,
		isError: false,
		errorMessage: '',
	});

	const handleUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserData({
			...userData,
			[e.target.name]: e.target.value,
		});
	};

	const clearUserData = () => {
		setUserData({
			name: '',
			description: '',
			hostUrl: '',
			successUrl: '',
		});
	};

	const handleClose = () => {
		if (!systemData.isLoading) {
			clearUserData();
			clearError();
			onClose();
		}
	};

	const setLoadingStatus = (status: boolean) => {
		setSystemData((prev) => ({
			...prev,
			isLoading: status,
		}));
	};

	const setError = (errorMessage: string) => {
		setSystemData((prev) => ({
			...prev,
			isError: true,
			errorMessage,
		}));
	};

	const clearError = () => {
		setSystemData({
			isLoading: false,
			isError: false,
			errorMessage: '',
		});
	};

	const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		clearError();
		setLoadingStatus(true);
		const [isSuccess, response] = await createProject(
			userData.name,
			userData.description,
			userData.hostUrl,
			userData.successUrl,
		);
		setLoadingStatus(false);

		if (isSuccess) {
			clearUserData();
			clearError();
			onClose();
			router.push(`/${response.uniqueName}`);
		} else {
			setError(response);
		}
	};

	return (
		<Dialog
			open={isOpen}
			onClose={handleClose}
			fullWidth
		>
			<DialogTitle>Create New Project</DialogTitle>
			<DialogContent>
				<div className="input-container">
					<TextField
						id="standard-basic"
						label="Name"
						name="name"
						variant="standard"
						fullWidth
						sx={{ my: 1.5 }}
						value={userData.name}
						onChange={handleUserData}
						disabled={systemData.isLoading}
					/>
					<TextField
						id="standard-basic"
						label="Description"
						name="description"
						variant="standard"
						fullWidth
						multiline
						rows={3}
						sx={{ my: 1.5 }}
						value={userData.description}
						onChange={handleUserData}
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
						value={userData.hostUrl}
						onChange={handleUserData}
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
						value={userData.successUrl}
						onChange={handleUserData}
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
					disabled={
						systemData.isLoading ||
						(!userData.name && !userData.hostUrl && !userData.successUrl)
					}
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
