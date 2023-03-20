'use client';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function MuiSnackbar({
	isOpen,
	duration,
	message,
	onClose,
	severity,
}: {
	isOpen: boolean;
	duration: number;
	message: string;
	onClose: () => void;
	severity: 'success' | 'error' | 'warning' | 'info';
} & any) {
	return (
		<Snackbar
			open={isOpen}
			autoHideDuration={duration}
			onClose={onClose}
			message={message}
		>
			<Alert
				onClose={onClose}
				severity={severity}
				sx={{ width: '100%' }}
			>
				{message}
			</Alert>
		</Snackbar>
	);
}
