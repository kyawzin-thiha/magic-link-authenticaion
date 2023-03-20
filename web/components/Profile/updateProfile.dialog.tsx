'use client';

import { useState, useTransition } from 'react';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SaveIcon from '@mui/icons-material/Save';
import { useRouter } from 'next/navigation';

const updateProfile = async (name: string, email: string) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API}/user/update`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name, email }),
		mode: 'cors',
		credentials: 'include',
	});
	if (response.ok) {
		return [true, ''];
	} else {
		const error = await response.json();
		return [false, error.message];
	}
};

export default function UpdateProfileDialog({
	isOpen,
	onClose,
	defaultData,
}: {
	isOpen: boolean;
	onClose: () => void;
	defaultData: { name: string; email: string };
}) {
	const router = useRouter();

	const [isPending, startTransition] = useTransition();

	const [userData, setUserData] = useState({
		name: '',
		email: '',
	});

	const [systemData, setSystemData] = useState({
		isLoading: false,
		isError: false,
		errorMessage: '',
		passwordError: false,
	});

	const handleClose = () => {
		if (!systemData.isLoading) {
			clearUserData();
			handleSystemData().clearError();
			onClose();
		}
	};

	const onUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserData({
			...userData,
			[e.target.name]: e.target.value,
		});
	};

	const clearUserData = () => {
		setUserData({
			name: '',
			email: '',
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
			userData.name,
			userData.email,
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
						label="New Name"
						name="name"
						variant="standard"
						defaultValue={defaultData.name}
						fullWidth
						sx={{ my: 1.5 }}
						onChange={onUserDataChange}
						disabled={systemData.isLoading}
					/>
					<TextField
						id="standard-basic"
						label="New Email"
						name="email"
						variant="standard"
						defaultValue={defaultData.email}
						fullWidth
						sx={{ my: 1.5 }}
						onChange={onUserDataChange}
						disabled={systemData.isLoading}
					/>
				</div>
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
					disabled={systemData.isLoading || (!userData.name && !userData.email)}
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
