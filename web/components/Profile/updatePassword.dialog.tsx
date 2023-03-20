'use client';

import { useState, useTransition } from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormHelperText from '@mui/material/FormHelperText';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SaveIcon from '@mui/icons-material/Save';
import { useRouter } from 'next/navigation';

const updatePassword = async (password: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API}/auth/update-password`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ password }),
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

export default function UpdatePasswordDialog({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const router = useRouter();

	const [isPending, startTransition] = useTransition();

	const [userData, setUserData] = useState({
		password: '',
		confirmPassword: '',
	});

	const [systemData, setSystemData] = useState({
		isLoading: false,
		isError: false,
		errorMessage: '',
		passwordError: false,
		isSuccess: false,
		showPassword: false,
	});

	const handleClose = () => {
		if (!systemData.isLoading) {
			clearUserData();
			handleSystemData().clearError();
			onClose();
		}
	};

	const onUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (userData.confirmPassword !== '') {
			checkConfirmPassword(
				e.target.name === 'password' ? 'confirmPassword' : 'password',
				e.target.value,
			);
		}
		setUserData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	const clearUserData = () => {
		setUserData({
			password: '',
			confirmPassword: '',
		});
	};

	const handleClickShowPassword = () => {
		setSystemData({
			...systemData,
			showPassword: !systemData.showPassword,
		});
	};

	const handleMouseDownPassword = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		event.preventDefault();
	};

	const checkConfirmPassword = (
		name: 'password' | 'confirmPassword',
		value: string,
	) => {
		if (userData[name] !== value) {
			handleSystemData().handlePasswordError(true, 'Passwords does not match');
		} else {
			handleSystemData().handlePasswordError(false, '');
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
			handlePasswordError: (status: boolean, errorMessage: string) =>
				setSystemData((prev) => ({
					...prev,
					passwordError: status,
					errorMessage,
				})),
			handelLoadingStatus: (isLoading: boolean) =>
				setSystemData((prev) => ({
					...prev,
					isLoading,
				})),
		};
	};

	const onSubmit = async () => {
		handleSystemData().clearError();
		handleSystemData().handelLoadingStatus(true);
		const [isSuccess, error] = await updatePassword(userData.password);
		handleSystemData().handelLoadingStatus(false);

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
			<DialogTitle>Change Password</DialogTitle>
			<DialogContent>
				<div className="input-container">
					<TextField
						id="standard-basic"
						label="New Password"
						name="password"
						placeholder="New Password"
						variant="standard"
						value={userData.password}
						fullWidth
						sx={{ my: 1.5 }}
						onChange={onUserDataChange}
						disabled={systemData.isLoading}
					/>

					<FormControl
						sx={{ my: 1.5 }}
						variant="standard"
						fullWidth
						error={systemData.passwordError}
						disabled={systemData.isLoading}
					>
						<InputLabel htmlFor="outlined-adornment-password">
							Confirm Password
						</InputLabel>
						<Input
							id="outlined-adornment-password"
							type={systemData.showPassword ? 'text' : 'password'}
							aria-describedby="outlined-adornment-password-helper-text"
							fullWidth
							name="confirmPassword"
							value={userData.confirmPassword}
							onChange={onUserDataChange}
							disabled={systemData.isLoading}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
										edge="end"
									>
										{systemData.showPassword ? (
											<VisibilityOff />
										) : (
											<Visibility />
										)}
									</IconButton>
								</InputAdornment>
							}
						/>
						{systemData.passwordError && (
							<FormHelperText>{systemData.errorMessage}</FormHelperText>
						)}
					</FormControl>
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
					disabled={
						systemData.isLoading ||
						userData.password !== userData.confirmPassword ||
						!userData.password
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
