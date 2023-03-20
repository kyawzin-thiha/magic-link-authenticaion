'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import SaveIcon from '@/assets/svg/authentication.svg';
import Button from '@mui/material/Button';

const registerUser = async (userData: {
	email: string;
	username: string;
}) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API}/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		mode: 'cors',
		credentials: 'include',
		body: JSON.stringify(userData),
	});

	if (response.ok) {
		return [true, ''];
	} else {
		const error = await response.json();
		return [false, error.message];
	}
};

export default function RegisterPage() {
	const router = useRouter();

	const [userData, setUserData] = useState({
		email: '',
		username: '',
	});

	const [systemData, setSystemData] = useState<{
		setEmailAsUsername: boolean;
		isLoading: boolean;
		isError: boolean;
		errorMessage: string;
	}>({
		setEmailAsUsername: true,
		isLoading: false,
		isError: false,
		errorMessage: '',
	});

	const onUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputReference = e.target.name;
		if (inputReference === 'email' && systemData.setEmailAsUsername) {
			setUserData({
				...userData,
				[e.target.name]: e.target.value,
				username: e.target.value,
			});
		} else {
			setUserData({
				...userData,
				[e.target.name]: e.target.value,
			});
		}
	};

	const setEmailAsUsername = () => {
		setSystemData((prev) => ({
			...prev,
			setEmailAsUsername: !prev.setEmailAsUsername,
		}));
		if (!systemData.setEmailAsUsername) {
			setUserData((prev) => ({
				...prev,
				username: userData.email,
			}));
		}
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
			isUsernameError: false,
			errorMessage: '',
		}));
	};

	const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		clearError();
		setLoadingStatus(true);
		const [isSuccess, error] = await registerUser(userData);
		setLoadingStatus(false);
		if (isSuccess) {
			router.replace('/complete');
		} else {
			setError(error);
			return;
		}
	};

	return (
		<>
			<h1>Register</h1>
			<div className="input-container">
				<FormGroup>
					<FormControlLabel
						control={
							<Switch
								defaultChecked
								size="small"
								value={systemData.setEmailAsUsername}
								onChange={setEmailAsUsername}
							/>
						}
						label="Email as username"
						sx={{ color: 'gray' }}
					/>
				</FormGroup>
				<TextField
					id="standard-basic"
					label="Email"
					name="email"
					placeholder="Email"
					variant="standard"
					fullWidth
					value={userData.email}
					onChange={onUserDataChange}
					error={systemData.isError}
					helperText={systemData.isError && systemData.errorMessage}
					disabled={systemData.isLoading}
				/>
				<TextField
					id="standard-basic"
					label="Username"
					name="username"
					placeholder="Username"
					variant="standard"
					fullWidth
					sx={{ mt: 1.5 }}
					value={userData.username}
					onChange={onUserDataChange}
					error={systemData.isError}
					helperText={systemData.errorMessage}
					disabled={systemData.isLoading || systemData.setEmailAsUsername}
				/>
			</div>
			<div className="action-btn-container">
				<LoadingButton
					type="submit"
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
					Sign Up
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
					<Link href="/login">Log In</Link>
				</Button>
			</div>
		</>
	);
}
