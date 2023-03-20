'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Lottie from 'lottie-react';
import Alert from '@mui/material/Alert';
import LoadingAnimation from '@/assets/animations/loading-shapes.json';

const validateEmail = async (token: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API}/auth/verify-email`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			mode: 'cors',
			credentials: 'include',
			body: JSON.stringify({ token }),
		},
	);

	if (response.ok) {
		return [true, ''];
	} else {
		const error = await response.json();
		return [false, error.message];
	}
};

export default function VerifyEmailPage({
	searchParams,
}: {
	searchParams: any;
}) {
	const key = searchParams.key;
	const router = useRouter();

	const [systemData, setSystemData] = useState({
		isLoading: false,
		isError: false,
		errorMessage: '',
	});

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

	const setLoading = (isLoading: boolean) => {
		setSystemData((prev) => ({
			...prev,
			isLoading,
		}));
	};

	const validate = async (key: string) => {
		clearError();
		setLoading(true);
		const [isSuccess, error] = await validateEmail(key);
		setLoading(false);
		if (isSuccess) {
			router.replace('/');
		} else {
			setError(error);
			return;
		}
	};

	useEffect(() => {
		if (key) {
			validate(key);
		} else {
			setError(
				"No key provided. Please check your email for the verification link",
			);
		}
	}, [key]);

	return (
		<>
			<h1>Email Verification</h1>
			<div className="alert-container">
				{systemData.isLoading && (
					<>
						<Lottie
							animationData={LoadingAnimation}
							loop={true}
						/>
					</>
				)}
				{systemData.isError && (
					<Alert
						severity="error"
						sx={{ width: '100%' }}
					>
						{systemData.errorMessage}
					</Alert>
				)}
			</div>
		</>
	);
}
