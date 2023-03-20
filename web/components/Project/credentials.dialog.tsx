import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { Typography } from '@mui/material';

type ProjectCredentialProps = {
	hostUrl: string;
	successUrl: string;
	uniqueKey: string;
};

type ProjectCountProps = {
	collections: number;
	blacklists: number;
}

export default function CredentialsDialog({
	isOpen,
	onClose,
	projectCredential,
	projectCount,
}: {
	isOpen: boolean;
	onClose: () => void;
	projectCredential: ProjectCredentialProps;
	projectCount: ProjectCountProps;
}) {
	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			fullWidth
		>
			<DialogTitle>Project Credentials</DialogTitle>
			<DialogContent>
				<Stack spacing={2}>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<Typography
							variant="body1"
							color="text.secondary"
							sx={{ fontWeight: 'bolder' }}
						>
							Host URL
						</Typography>
						<Typography variant="body1">{projectCredential.hostUrl}</Typography>
					</Stack>
					<Divider></Divider>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<Typography
							variant="body1"
							color="text.secondary"
							sx={{ fontWeight: 'bolder' }}
						>
							Success URL
						</Typography>
						<Typography variant="body1">
							{projectCredential.successUrl}
						</Typography>
					</Stack>
					<Divider></Divider>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<Typography
							variant="body1"
							color="text.secondary"
							sx={{ fontWeight: 'bolder' }}
						>
							Unique Key
						</Typography>
						<Typography variant="body1">
							{projectCredential.uniqueKey}
						</Typography>
					</Stack>
					<Divider></Divider>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<Typography
							variant="body1"
							color="text.secondary"
							sx={{ fontWeight: 'bolder' }}
						>
							Active Users
						</Typography>
						<Typography variant="body1">
							{projectCount.collections}
						</Typography>
					</Stack>
					<Divider></Divider>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<Typography
							variant="body1"
							color="text.secondary"
							sx={{ fontWeight: 'bolder' }}
						>
							Blacklisted Users
						</Typography>
						<Typography variant="body1">
							{projectCount.blacklists}
						</Typography>
					</Stack>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
			</DialogActions>
		</Dialog>
	);
}
