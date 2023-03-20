'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SaveIcon from '@mui/icons-material/Save';
import Alert from '@mui/material/Alert';

type blacklistProp = {
	id: string;
	email: string;
	isActive: boolean;
	createdAt: string;
};

const updateBlacklist = async (
	id: string,
	email: string,
	isActive: boolean,
) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API}/blacklist/update/${id}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			mode: 'cors',
			credentials: 'include',
			body: JSON.stringify({ email, isActive }),
		},
	);

	if (response.ok) {
		return true;
	} else {
		return false;
	}
};

export default function UpdateBlacklistDialog({
	isOpen,
	onClose,
	blacklist,
}: {
	isOpen: boolean;
	onClose: () => void;
	blacklist: blacklistProp;
}) {
	const router = useRouter();

	const [isPending, startTransition] = useTransition();

	const [blacklistData, setBlacklistData] = useState({
		email: blacklist.email,
		isActive: blacklist.isActive,
	});
	const [systemData, setSystemData] = useState({
		isLoading: false,
		isError: false,
		errorMessage: '',
		passwordError: false,
	});

	const handleClose = () => {
		if (!systemData.isLoading) {
			handleSystemData().clearError();
			onClose();
		}
	};

	const handleBlacklistData = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.name === 'isActive') {
			setBlacklistData((prev) => ({
				...prev,
				[e.target.name]: e.target.checked,
			}));
		} else {
			setBlacklistData((prev) => ({
				...prev,
				[e.target.name]: e.target.value,
			}));
		}
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
		const isSuccess = await updateBlacklist(
			blacklist.id,
			blacklistData.email,
			blacklistData.isActive,
		);
		handleSystemData().handleLoadingStatus(false);

		if (isSuccess) {
			onClose();
			startTransition(() => {
				router.refresh();
			});
		} else {
			handleSystemData().setError(
				'Failed to update blacklist. Please try again later.',
			);
		}
	};
	return (
		<Dialog
			open={isOpen}
			onClose={handleClose}
			fullWidth
		>
			<DialogTitle>Update Blacklisted Email</DialogTitle>
			<DialogContent>
				<div className="input-container">
					<TextField
						id="standard-basic"
						label="Email"
						name="email"
						variant="standard"
						fullWidth
						sx={{ my: 1.5 }}
						value={blacklistData.email}
						onChange={handleBlacklistData}
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
					disabled={systemData.isLoading}
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
