'use client';

import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import SaveIcon from '@/assets/svg/authentication.svg';
import React, { useState } from 'react';
import Image from 'next/image';

const requestPasswordReset = async (usernameOrEmail: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API}/auth/request-password-reset`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			mode: 'cors',
			credentials: 'include',
			body: JSON.stringify({ usernameOrEmail }),
		},
	);

	if (response.ok) {
		return [true, ''];
	} else {
		const error = await response.json();
		return [false, error.message];
	}
};

export default function ForgetPasswordPage() {
	const [userData, setUserData] = useState('');

	const [systemData, setSystemData] = useState({
		isLoading: false,
		isError: false,
		isSuccess: false,
		errorMessage: '',
	});

	const onUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserData(e.target.value);
	};

	const setIsSuccess = (isSuccess: boolean) => {
		setSystemData((prev) => ({
			...prev,
			isSuccess,
		}));
	};

	const setLoading = (isLoading: boolean) => {
		setSystemData((prev) => ({
			...prev,
			isLoading,
		}));
	};

	const setError = (message: string) => {
		setSystemData((prev) => ({
			...prev,
			isError: true,
			errorMessage: message,
		}));
	};

	const clearError = () => {
		setSystemData((prev) => ({
			...prev,
			isError: false,
			errorMessage: '',
		}));
	};

	const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		clearError();
		setLoading(true);
		const [isSuccess, error] = await requestPasswordReset(userData);
		setLoading(false);
		if (isSuccess) {
			setIsSuccess(true);
			return;
		} else {
			setError(error);
			return;
		}
	};
	return (
		<>
			<h1>Forget Password</h1>
			<div className="input-container">
				<TextField
					id="standard-basic"
					label="Username Or Email"
					name="UsernameOrEmail"
					placeholder="Username Or Email"
					variant="standard"
					fullWidth
					sx={{ mt: 1.5 }}
					value={userData}
					onChange={onUserDataChange}
					error={systemData.isError}
					helperText={systemData.errorMessage}
					disabled={systemData.isLoading}
				/>
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
					Submit
				</LoadingButton>
			</div>
			<div className="action-container">
				{systemData.isSuccess && (
					<Alert severity="success">
						Password reset link has been sent to your email
					</Alert>
				)}
			</div>
		</>
	);
}
