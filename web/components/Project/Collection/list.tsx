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
import Moment from 'react-moment';
import MuiSnackbar from '@/components/Snackbar';
import DeleteCollectionDialog from './deleteCollection.dialog';

type collectionProp = {
	id: string;
	username: string;
	email: string;
	isActive: boolean;
	createdAt: string;
};

const activateCollection = async (id: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API}/collection/activate/${id}`,
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

const deactivateCollection = async (id: string) => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API}/collection/deactivate/${id}`,
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

export default function CollectionsList({
	collections,
}: {
	collections: collectionProp[];
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
									Username
								</Typography>
							</TableCell>
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
						{collections.map((collection) => (
							<CollectionInfo
								collection={collection}
								key={collection.id}
							/>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}

function CollectionInfo({ collection }: { collection: collectionProp }) {
	const router = useRouter();

	const [isActive, setIsActive] = useState(collection.isActive);
	const [isDeleteCollectionDialogOpen, setDeleteCollectionDialogOpen] =
		useState(false);
	const [isError, setError] = useState(false);
	const [isPending, startTransition] = useTransition();

	const clearError = () => {
		setError(false);
	};

	const handleCollectionStatus = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setIsActive(true);
			const isSuccess = await activateCollection(collection.id);
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
			const isSuccess = await deactivateCollection(collection.id);
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

	const handleDeleteCollection = async () => {
		setDeleteCollectionDialogOpen(!isDeleteCollectionDialogOpen);
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
					<Typography variant="body2">{collection.username}</Typography>
				</TableCell>
				<TableCell align="center">
					<Typography variant="body2">{collection.email}</Typography>
				</TableCell>
				<TableCell align="center">
					<ActiveSwitch
						checked={isActive}
						onChange={handleCollectionStatus}
					/>
				</TableCell>
				<TableCell align="center">
					<Typography variant="body2">
						<Moment
							format="D MMM YYYY"
							withTitle
						>
							{collection.createdAt}
						</Moment>
					</Typography>
				</TableCell>
				<TableCell align="center">
					<IconButton
						color="error"
						onClick={handleDeleteCollection}
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

			<DeleteCollectionDialog
				isOpen={isDeleteCollectionDialogOpen}
				onClose={handleDeleteCollection}
				collectionId={collection.id}
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
