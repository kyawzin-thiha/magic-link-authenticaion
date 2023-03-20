'use client';

import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import NoSSR from '@mui/material/NoSsr';
import MuiSnackbar from '../Snackbar';
import UpdatePasswordDialog from './updatePassword.dialog';
import UpdateProfileDialog from './updateProfile.dialog';
import DeleteAccountDialog from './deleteAccount.dialog';

type profileProps = {
	avatar: string;
	name: string;
	email: string;
	isVerified: boolean;
};

const requestEmailVerification = async () => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API}/auth/request-email-verification`,
		{
			method: 'POST',
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

export default function Profile({ userData }: { userData: profileProps }) {
	const [systemData, setSystemData] = useState({
		isEmailSent: false,
		isError: false,
		errorMessage: '',
		isUpdatePasswordDialogOpen: false,
		isUpdateProfileDialogOpen: false,
		isDeleteAccountDialogOpen: false,
	});

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
					errorMessage: '',
				})),
			handleEmailNotification: () =>
				setSystemData((prev) => ({
					...prev,
					isEmailSent: !prev.isEmailSent,
				})),
			handleUpdatePasswordDialog: () =>
				setSystemData((prev) => ({
					...prev,
					isUpdatePasswordDialogOpen: !prev.isUpdatePasswordDialogOpen,
				})),
			handleUpdateProfileDialog: () =>
				setSystemData((prev) => ({
					...prev,
					isUpdateProfileDialogOpen: !prev.isUpdateProfileDialogOpen,
				})),
			handleDeleteAccountDialog: () =>
				setSystemData((prev) => ({
					...prev,
					isDeleteAccountDialogOpen: !prev.isDeleteAccountDialogOpen,
				})),
		};
	};

	const sendEmailVerification = async () => {
		const [isSuccess, error] = await requestEmailVerification();
		if (isSuccess) {
			handleSystemData().handleEmailNotification();
		} else {
			handleSystemData().setError(error);
		}
	};

	return (
		<NoSSR>
			<Stack
				direction={{ sm: 'column', md: 'row' }}
				alignItems="center"
				sx={{ py: { sm: 3, md: 5 }, px: { sm: 0, md: 5 }, mb: 3 }}
			>
				<Avatar
					src={`https://${userData.avatar}`}
					alt={userData.name}
					sx={{ width: 130, height: 130, mr: { sm: 0, md: 10 } }}
				/>
				<Typography
					variant="h4"
					color="text.secondary"
				>
					{userData.name}
				</Typography>
			</Stack>
			<Stack
				direction="row"
				justifyContent="space-between"
				sx={{ py: 2, my: 2 }}
			>
				<Typography
					variant="h5"
					color="text.secondary"
				>
					User Infos
				</Typography>

				<Button
					variant="contained"
					disableElevation
					size="small"
					onClick={handleSystemData().handleUpdateProfileDialog}
					sx={{ background: '#BDDBBD', ':hover': { background: '#A3CCA3' } }}
				>
					Edit Profile
				</Button>
			</Stack>
			<Stack
				spacing={3}
				sx={{ my: 2 }}
			>
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
				>
					<Typography
						color="text.secondary"
						sx={{ typography: { sm: 'h7', md: 'h6' } }}
					>
						Name
					</Typography>
					<Typography
						color="text.secondary"
						sx={{ typography: { sm: 'h7', md: 'h6' } }}
					>
						{userData.name}
					</Typography>
				</Stack>
				<Divider />
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
				>
					<Typography
						sx={{ typography: { sm: 'h7', md: 'h6' } }}
						color="text.secondary"
					>
						Email
					</Typography>
					<Typography
						sx={{ typography: { sm: 'h7', md: 'h6' } }}
						color="text.secondary"
					>
						{userData.email}
					</Typography>
				</Stack>
				<Divider />
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
				>
					<Typography
						sx={{ typography: { sm: 'h7', md: 'h6' } }}
						color="text.secondary"
					>
						Is Email Verified
					</Typography>
					{userData.isVerified ? (
						<Typography
							sx={{ typography: { sm: 'h7', md: 'h6' } }}
							color="text.secondary"
						>
							Yes
						</Typography>
					) : (
						<Button
							variant="contained"
							disableElevation
							size="small"
							onClick={sendEmailVerification}
							sx={{
								background: '#F9DEB3',
								':hover': { background: '#F4C67B' },
							}}
						>
							Verify Email
						</Button>
					)}
				</Stack>
				<Divider />
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
				>
					<Typography
						sx={{ typography: { sm: 'h7', md: 'h6' } }}
						color="text.secondary"
					>
						Update Password
					</Typography>

					<Button
						variant="contained"
						disableElevation
						size="small"
						onClick={handleSystemData().handleUpdatePasswordDialog}
						sx={{
							background: '#CDD1B3',
							':hover': { background: '#B4BA8C' },
						}}
					>
						Update Password
					</Button>
				</Stack>
			</Stack>
			<Stack
				justifyContent="space-between"
				spacing={3}
				sx={{ py: 2, my: 2 }}
			>
				<Typography
					variant="h5"
					color="error.main"
				>
					Danger Zone
				</Typography>
				<Stack
					direction="row"
					spacing={2}
					alignItems="center"
					justifyContent="space-between"
					sx={{ py: 2 }}
				>
					<Typography
						sx={{ typography: { sm: 'h7', md: 'h6' } }}
						color="error.main"
					>
						Delete Account
					</Typography>
					<Button
						variant="contained"
						disableElevation
						color="error"
						size="small"
						onClick={handleSystemData().handleDeleteAccountDialog}
					>
						Delete Account
					</Button>
				</Stack>
			</Stack>
			<MuiSnackbar
				isOpen={systemData.isEmailSent || systemData.isError}
				duration={5000}
				message={
					systemData.errorMessage ||
					'Email verification link has been sent to your email address'
				}
				onClose={
					systemData.isEmailSent
						? handleSystemData().handleEmailNotification
						: handleSystemData().clearError
				}
				severity={systemData.isEmailSent ? 'success' : 'error'}
			/>
			<UpdatePasswordDialog
				isOpen={systemData.isUpdatePasswordDialogOpen}
				onClose={handleSystemData().handleUpdatePasswordDialog}
			/>
			<UpdateProfileDialog
				isOpen={systemData.isUpdateProfileDialogOpen}
				onClose={handleSystemData().handleUpdateProfileDialog}
				defaultData={{ name: userData.name, email: userData.email }}
			/>
			<DeleteAccountDialog
				isOpen={systemData.isDeleteAccountDialogOpen}
				onClose={handleSystemData().handleDeleteAccountDialog}
			/>
		</NoSSR>
	);
}
