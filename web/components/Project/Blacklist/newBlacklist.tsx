import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';

const createNewBlacklist = async (
	email: string,
	isActive: boolean,
	projectId : string,
) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API}/blacklist/create`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			mode: 'cors',
			credentials: 'include',
			body: JSON.stringify({ projectId, email, isActive }),
		},
	);

	if (response.ok) {
		return true;
	} else {
		return false;
	}
};

export default function NewBlacklistDialog({
	isOpen,
	onClose,
	projectId,
}: {
	isOpen: boolean;
	onClose: () => void;
	projectId: string;
}) {
	const router = useRouter();

	const [blacklistData, setBlacklistData] = useState({
		email: '',
		isActive: false,
	});

	const [systemData, setSystemData] = useState({
		isLoading: false,
		isError: false,
		errorMessage: '',
	});

	const [isPending, startTransition] = useTransition();

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

	const clearUserData = () => {
		setBlacklistData({
			email: '',
			isActive: false,
		});
	};

	const handleClose = () => {
		if (!systemData.isLoading) {
			clearUserData();
			clearError();
			onClose();
		}
	};

	const setLoadingStatus = (status: boolean) => {
		setSystemData((prev) => ({
			...prev,
			isLoading: status,
		}));
	};

	const setError = (errorMessage: string) => {
		setSystemData((prev) => ({
			...prev,
			isError: true,
			errorMessage,
		}));
	};

	const clearError = () => {
		setSystemData({
			isLoading: false,
			isError: false,
			errorMessage: '',
		});
	};

	const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		clearError();
		setLoadingStatus(true);
		const isSuccess = await createNewBlacklist(
			blacklistData.email,
			blacklistData.isActive,
			projectId,
		);
		setLoadingStatus(false);

		if (isSuccess) {
			clearUserData();
			clearError();
			onClose();
			startTransition(() => {
				router.refresh();
			});
		} else {
			setError('Failed to create new blacklist. Please try again later.');
		}
	};

	return (
		<Dialog
			open={isOpen}
			onClose={handleClose}
			fullWidth
		>
			<DialogTitle>Create New Project</DialogTitle>
			<DialogContent>
				<div className="input-container">
					<Stack
						direction="row"
						spacing={5}
						alignItems="center"
						justifyContent="space-around"
					>
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
						<FormControlLabel
							control={
								<ActiveSwitch
									sx={{ m: 1 }}
									name="isActive"
									checked={blacklistData.isActive}
									onChange={handleBlacklistData}
								/>
							}
							label="Active"
							labelPlacement="top"
						/>
					</Stack>
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
					disabled={systemData.isLoading || !blacklistData.email}
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

const ActiveSwitch = styled((props: SwitchProps) => (
	<Switch
		focusVisibleClassName=".Mui-focusVisible"
		disableRipple
		{...props}
	/>
))(({ theme }) => ({
	width: 42,
	height: 26,
	padding: 0,
	'& .MuiSwitch-switchBase': {
		padding: 0,
		margin: 2,
		transitionDuration: '300ms',
		'&.Mui-checked': {
			transform: 'translateX(16px)',
			color: '#fff',
			'& + .MuiSwitch-track': {
				backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
				opacity: 1,
				border: 0,
			},
			'&.Mui-disabled + .MuiSwitch-track': {
				opacity: 0.5,
			},
		},
		'&.Mui-focusVisible .MuiSwitch-thumb': {
			color: '#33cf4d',
			border: '6px solid #fff',
		},
		'&.Mui-disabled .MuiSwitch-thumb': {
			color:
				theme.palette.mode === 'light'
					? theme.palette.grey[100]
					: theme.palette.grey[600],
		},
		'&.Mui-disabled + .MuiSwitch-track': {
			opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
		},
	},
	'& .MuiSwitch-thumb': {
		boxSizing: 'border-box',
		width: 22,
		height: 22,
	},
	'& .MuiSwitch-track': {
		borderRadius: 26 / 2,
		backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
		opacity: 1,
		transition: theme.transitions.create(['background-color'], {
			duration: 500,
		}),
	},
}));
