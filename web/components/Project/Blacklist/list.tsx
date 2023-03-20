'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import Switch, { SwitchProps } from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Moment from 'react-moment';
import MuiSnackbar from '@/components/Snackbar';
import DeleteBlacklistDialog from './deleteBlacklist.dialog';
import UpdateBlacklistDialog from './updateBlacklist.dialog';

type blacklistProp = {
	id: string;
	email: string;
	isActive: boolean;
	createdAt: string;
};

const activateBlacklist = async (id: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API}/blacklist/activate/${id}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			mode: 'cors',
			credentials: 'include',
		},
	);

	if (response.ok) {
		return true;
	} else {
		return false;
	}
};

const deactivateBlacklist = async (id: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API}/blacklist/activate/${id}`,
		{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			mode: 'cors',
			credentials: 'include',
		},
	);

	if (response.ok) {
		return true;
	} else {
		return false;
	}
};

export default function BlacklistsList({
	blacklists,
}: {
	blacklists: blacklistProp[];
}) {
	return (
		<>
			<TableContainer
				component={Paper}
				sx={{
					boxShadow: 'none',
					background: 'transparent',
				}}
			>
				<Table
					sx={{
						minWidth: 650,
					}}
					aria-label="Collections Table"
				>
					<TableHead>
						<TableRow>
							<TableCell align="center">
								<Typography
									color="text.secondary"
									variant="body1"
									sx={{ fontWeight: 'bolder' }}
								>
									Email
								</Typography>
							</TableCell>
							<TableCell align="center">
								<Typography
									color="text.secondary"
									variant="body1"
									sx={{ fontWeight: 'bolder' }}
								>
									Is Active
								</Typography>
							</TableCell>
							<TableCell align="center">
								<Typography
									color="text.secondary"
									variant="body1"
									sx={{ fontWeight: 'bolder' }}
								>
									Created At
								</Typography>
							</TableCell>
							<TableCell align="center">
								<Typography
									color="text.secondary"
									variant="body1"
									sx={{ fontWeight: 'bolder' }}
								>
									Actions
								</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{blacklists.map((blacklist) => (
							<BlacklistInfo
								blacklist={blacklist}
								key={blacklist.id}
							/>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}

function BlacklistInfo({ blacklist }: { blacklist: blacklistProp }) {
	const router = useRouter();

	const [isActive, setIsActive] = useState(blacklist.isActive);
	const [isDeleteBlacklistDialogOpen, setDeleteBlacklistDialogOpen] =
		useState(false);
	const [isUpdateBlacklistDialogOpen, setUpdateBlacklistDialogOpen] =
		useState(false);
	const [isError, setError] = useState(false);
	const [isPending, startTransition] = useTransition();

	const clearError = () => {
		setError(false);
	};

	const handleBlacklistStatus = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		if (e.target.checked) {
			setIsActive(true);
			const isSuccess = await activateBlacklist(blacklist.id);
			if (isSuccess) {
				startTransition(() => {
					router.refresh();
				});
			} else {
				setIsActive(false);
				setError(true);
			}
		} else {
			setIsActive(false);
			const isSuccess = await deactivateBlacklist(blacklist.id);
			if (isSuccess) {
				startTransition(() => {
					router.refresh();
				});
			} else {
				setIsActive(true);
				setError(true);
			}
		}
	};

	const handleUpdateBlacklist = () => {
		setUpdateBlacklistDialogOpen(!isUpdateBlacklistDialogOpen);
	};

	const handleDeleteBlacklist = () => {
		setDeleteBlacklistDialogOpen(!isDeleteBlacklistDialogOpen);
	};

	return (
		<>
			<TableRow
				sx={{
					height: 30,
					'&:last-child td, &:last-child th': { border: 0 },
				}}
			>
				<TableCell align="center">
					<Typography variant="body2">{blacklist.email}</Typography>
				</TableCell>
				<TableCell align="center">
					<ActiveSwitch
						sx={{ m: 1 }}
						checked={isActive}
						onChange={handleBlacklistStatus}
					/>
				</TableCell>
				<TableCell align="center">
					<Typography variant="body2">
						<Moment
							format="D MMM YYYY"
							withTitle
						>
							{blacklist.createdAt}
						</Moment>
					</Typography>
				</TableCell>
				<TableCell align="center">
					<IconButton
						onClick={handleUpdateBlacklist}
						sx={{ mx: 1 }}
					>
						<MoreHorizIcon />
					</IconButton>
					<IconButton
						color="error"
						onClick={handleDeleteBlacklist}
						sx={{ mx: 1 }}
					>
						<DeleteIcon />
					</IconButton>
				</TableCell>
			</TableRow>
			<MuiSnackbar
				isOpen={isError}
				onClose={clearError}
				duration={5000}
				message="Something went wrong"
				severity="error"
			/>
			<UpdateBlacklistDialog
				isOpen={isUpdateBlacklistDialogOpen}
				onClose={handleUpdateBlacklist}
				blacklist={blacklist}
			/>
			<DeleteBlacklistDialog
				isOpen={isDeleteBlacklistDialogOpen}
				onClose={handleDeleteBlacklist}
				blacklistId={blacklist.id}
			/>
		</>
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
