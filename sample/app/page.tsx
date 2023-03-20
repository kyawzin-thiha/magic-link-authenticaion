'use client';

import Button from '@mui/material/Button';
import Divider from "@mui/material/Divider";
import Link from 'next/link';

export default function LandingPage() {
	return (
		<>
			<h1>Testing form CEAS</h1>
			<div className="input-container">
				<Link
					href={`${process.env.NEXT_PUBLIC_API}/request-login-redirect/${process.env.NEXT_PUBLIC_PROJECT_UNIQUE_ID}`}
				>
					<Button
						variant="contained"
						color="primary"
						fullWidth
						disableElevation
						sx={{
							mt: 1,
							background: '#7BE0C3',
							':hover': { background: '#84EBC2' },
						}}
					>
						Login
					</Button>
				</Link>
				<Divider sx={{ my: 2 }} flexItem >Or</Divider>
				<Link
					href={`${process.env.NEXT_PUBLIC_API}/request-register-redirect/${process.env.NEXT_PUBLIC_PROJECT_UNIQUE_ID}`}
				>
					<Button
						variant="contained"
						color="primary"
						fullWidth
						disableElevation
						sx={{
							mt: 1,
							background: '#7BE0C3',
							':hover': { background: '#84EBC2' },
						}}
					>
						Register
					</Button>
				</Link>
			</div>
		</>
	);
}
