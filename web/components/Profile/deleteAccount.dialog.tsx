'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';

const deleteAccount = async () => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API}/auth/delete-account`,
		{
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
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

export default function DeleteAccountDialog({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(false);

	const handleClose = () => {
		if (!isLoading) {
			onClose();
		}
	};

	const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsLoading(true);
		await deleteAccount();
		router.replace('/register');

	};

	return (
		<Dialog
			open={isOpen}
			onClose={handleClose}
			fullWidth
		>
			<DialogTitle>Delete Account</DialogTitle>
			<DialogContent>
				<Typography
					variant="body1"
					color="text.secondary"
				>
					Are you sure you want to delete your account? We won&apos;t able to
					recover all of your data once deleted.
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button
					variant="contained"
                    disableElevation
					size="small"
                    disabled={isLoading}
					onClick={handleClose}
				>
					Cancel
				</Button>
				<LoadingButton
					loading={isLoading}
					color="error"
					variant="contained"
					disableElevation
					size="small"
					onClick={handleConfirm}
					sx={{
						my: 1,
					}}
				>
					Confirm
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}
