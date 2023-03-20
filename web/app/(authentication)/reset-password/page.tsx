'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import FormHelperText from '@mui/material/FormHelperText';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@/assets/svg/authentication.svg';

const resetPassword = async (token: string, password: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API}/auth/reset-password`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			mode: 'cors',
			body: JSON.stringify({ token, password }),
		},
	);

	if (response.ok) {
		return [true, ''];
	} else {
		const error = await response.json();
		return [false, error.message];
	}
};

export default function ResetPasswordPage({
	searchParams,
}: {
	searchParams: { key: string };
}) {
	const router = useRouter();

	const key = searchParams.key;

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

	const onUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.name === 'confirmPassword') {
			checkConfirmPassword(e.target.value);
		}
		setUserData({
			...userData,
			[e.target.name]: e.target.value,
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

	const setIsSuccess = (isSuccess: boolean) => {
		setSystemData((prev) => ({
			...prev,
			isSuccess,
		}));
	};

	const setLoadingStatus = (isLoading: boolean) => {
		setSystemData((prev) => ({
			...prev,
			isLoading,
		}));
	};

	const setPasswordError = (errorMessage: string) => {
		setSystemData((prev) => ({
			...prev,
			passwordError: true,
			errorMessage,
		}));
	};

	const setError = (errorMessage: string) => {
		setSystemData((prev) => ({
			...prev,
			isError: true,
			errorMessage,
		}));
	};

	const clearPasswordError = () => {
		setSystemData((prev) => ({
			...prev,
			passwordError: false,
			errorMessage: '',
		}));
	};

	const clearError = () => {
		setSystemData((prev) => ({
			...prev,
			isError: false,
			errorMessage: '',
		}));
	};

	const checkConfirmPassword = (confirmPassword: string) => {
		if (confirmPassword !== userData.password) {
			setPasswordError('Passwords does not match');
		} else {
			clearPasswordError();
		}
	};

	const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setLoadingStatus(true);
		clearError();
		const [isSuccess, error] = await resetPassword(key, userData.password);
		setLoadingStatus(false);
		if (isSuccess) {
			setIsSuccess(true);
			setTimeout(() => {
				router.replace('/login');
			}, 3000);
		} else {
			setError(error);
			return;
		}
	};
	return (
		<>
			<h1>Reset Password</h1>
			<div className="input-container">
				<TextField
					id="standard-basic"
					label="New Password"
					name="password"
					placeholder="New Password"
					variant="standard"
					fullWidth
					value={userData.password}
					sx={{ mt: 1.5 }}
					onChange={onUserDataChange}
					disabled={systemData.isLoading}
				/>

				<FormControl
					sx={{ mt: 1.5 }}
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
						onChange={onUserDataChange}
						value={userData.confirmPassword}
						disabled={systemData.isLoading}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
									edge="end"
								>
									{systemData.showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
					/>
					{systemData.passwordError && (
						<FormHelperText>{systemData.errorMessage}</FormHelperText>
					)}
				</FormControl>
			</div>
			<div className="action-btn-container">
				<LoadingButton
					loading={systemData.isLoading}
					loadingPosition="start"
					startIcon={
						<Image
							src={SaveIcon}
							alt=""
							width="25"
							height="25"
						/>
					}
					variant="contained"
					fullWidth
					disableElevation
					disabled={systemData.isLoading}
					onClick={onSubmit}
					sx={{
						my: 1,
						background: '#7BE0C3',
						':hover': { background: '#84EBC2' },
					}}
				>
					Reset Password
				</LoadingButton>
			</div>
			<div className="alert-container">
				{systemData.isError && (
					<Alert severity="error">{systemData.errorMessage}</Alert>
				)}
				{systemData.isSuccess && (
					<Alert severity="success">
						Password reset successfully. You will be redirected in 3s
					</Alert>
				)}
			</div>
		</>
	);
}
