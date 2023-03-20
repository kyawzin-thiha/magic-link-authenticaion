'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@/assets/svg/authentication.svg';
import Button from '@mui/material/Button';

const registerUser = async (userData: {
	name: string;
	email: string;
	username: string;
	password: string;
}) => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/register`, {
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

const getAllUsernames = async () => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API}/auth/get-all-usernames`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		},
	);

	if (response.ok) {
		const data = await response.json();
		return data;
	} else {
		return [];
	}
};

export default function RegisterPage() {
	const router = useRouter();

	const [userData, setUserData] = useState({
		name: '',
		email: '',
		username: '',
		password: '',
	});

	const [systemData, setSystemData] = useState<{
		setEmailAsUsername: boolean;
		isLoading: boolean;
		isError: boolean;
		isUsernameError: boolean;
		errorMessage: string;
		showPassword: boolean;
		usernames: string[];
	}>({
		setEmailAsUsername: true,
		isLoading: false,
		isError: false,
		isUsernameError: false,
		errorMessage: '',
		showPassword: false,
		usernames: [],
	});

	const onUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputReference = e.target.name;
		if (inputReference === 'email' && systemData.setEmailAsUsername) {
			setUserData({
				...userData,
				[e.target.name]: e.target.value,
				username: e.target.value,
			});
		} else if (inputReference === 'username') {
			setUserData({
				...userData,
				[e.target.name]: e.target.value,
			});
			checkAvailableUsername(e.target.value);
		} else {
			setUserData({
				...userData,
				[e.target.name]: e.target.value,
			});
		}
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

	const setUsernames = (usernames: string[]) => {
		setSystemData((prev) => ({
			...prev,
			usernames,
		}));
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

	const setUsernameError = (message: string) => {
		setSystemData((prev) => ({
			...prev,
			isUsernameError: true,
			errorMessage: message,
		}));
	};

	const clearUsernameError = () => {
		setSystemData((prev) => ({
			...prev,
			isUsernameError: false,
			errorMessage: '',
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
			router.replace('/');
		} else {
			setError(error);
			return;
		}
	};

	const checkAvailableUsername = (username: string) => {
		if (systemData.usernames.includes(username)) {
			setUsernameError('Username is already taken');
		} else {
			clearUsernameError();
		}
	};

	useEffect(() => {
		if (systemData.usernames.length === 0) {
			const getAllUsernamesAsync = async () => {
				const data = await getAllUsernames();
				setUsernames(data);
			};
			getAllUsernamesAsync();
		}
	}, []);

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
				<Stack
					direction="row"
					spacing={2}
				>
					<TextField
						id="standard-basic"
						label="Name"
						name="name"
						placeholder="Name"
						variant="standard"
						fullWidth
						value={userData.name}
						onChange={onUserDataChange}
						disabled={systemData.isLoading}
					/>
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
				</Stack>
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
					error={systemData.isError || systemData.isUsernameError}
					helperText={systemData.errorMessage}
					disabled={systemData.isLoading || systemData.setEmailAsUsername}
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
						fullWidth
						name="password"
						value={userData.password}
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
					<FormHelperText>
						{systemData.isError ? systemData.errorMessage : ''}
					</FormHelperText>
				</FormControl>
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
					disabled={systemData.isLoading || systemData.isUsernameError}
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
