'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@/assets/svg/authentication.svg';
import Button from '@mui/material/Button';

const loginUser = async (userData: { username: string; password: string }) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		mode: 'cors',
		body: JSON.stringify(userData),
	});

	if (response.ok) {
		return [true, ''];
	} else {
		const error = await response.json();
		return [false, error.message];
	}
};

export default function LoginPage() {
	const router = useRouter();

	const [userData, setUserData] = useState({
		username: '',
		password: '',
	});

	const [systemData, setSystemData] = useState({
		isLoading: false,
		isError: false,
		errorMessage: '',
		showPassword: false,
	});

	const onUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

	const setLoadingStatus = (status: boolean) => {
		setSystemData((prev) => ({
			...prev,
			isLoading: status,
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
		setLoadingStatus(true);
		clearError();
		const [isSuccess, error] = await loginUser(userData);
		setLoadingStatus(false);
		if (isSuccess) {
			router.replace('/');
		} else {
			setError(error);
			return;
		}
	};
	return (
		<>
			<h1>Login</h1>
			<div className="input-container">
				<TextField
					id="standard-basic"
					label="Username"
					name="username"
					placeholder="Username or email"
					variant="standard"
					fullWidth
					sx={{ mt: 1.5 }}
					onChange={onUserDataChange}
					error={systemData.isError}
					helperText={systemData.errorMessage}
					disabled={systemData.isLoading}
				/>

				<FormControl
					sx={{ mt: 1.5 }}
					variant="standard"
					fullWidth
					error={systemData.isError}
					disabled={systemData.isLoading}
				>
					<InputLabel htmlFor="outlined-adornment-password">
						Password
					</InputLabel>
					<Input
						id="outlined-adornment-password"
						type={systemData.showPassword ? 'text' : 'password'}
						aria-describedby="outlined-adornment-password-helper-text"
						fullWidth
						name="password"
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
									{systemData.showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
					/>
					{systemData.isError && (
						<FormHelperText>{systemData.errorMessage}</FormHelperText>
					)}
				</FormControl>
			</div>
			<div className="forgot-password-label">
				<Link href="/forget-password">Forgot Password</Link>
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
					Log In
				</LoadingButton>
				<Divider flexItem>Or</Divider>
				<Button
					fullWidth
					disableElevation
					disabled={systemData.isLoading}
					sx={{
						mt: 1,
						background: '#7BE0C3',
						':hover': { background: '#84EBC2' },
					}}
				>
					<Link href="/register">Register</Link>
				</Button>
			</div>
		</>
	);
}
