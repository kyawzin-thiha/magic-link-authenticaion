'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Person from '@mui/icons-material/Person';
import AddNewProject from '@mui/icons-material/PostAdd';
import Logout from '@mui/icons-material/Logout';
import LogoIcon from '@/assets/svg/logo.svg';
import { useRouter } from 'next/navigation';
import NewProjectDialog from '../Project/newProject';

const logout = async () => {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/logout`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		mode: 'cors',
		credentials: 'include',
	});

	if (response.ok) {
		return true;
	} else {
		return false;
	}
};

export default function NavBar({ avatar, name }: { avatar: string; name: string }) {
	const router = useRouter();

	const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = async (e: any) => {
		const isSuccess = await logout();
		if (isSuccess) {
			router.replace('/login');
		}
	};

	const handleCreateNewProject = () => {
		setIsNewProjectDialogOpen((prev) => !prev);
	}

	return (
		<>
			<AppBar
				position="static"
				sx={{ background: '#D1F0E5', maxHeight: 60, boxShadow: 'none' }}
			>
				<Container
					maxWidth="xl"
					sx={{ py: 1 }}
				>
					<Stack
						direction="row"
						justifyContent="space-between"
					>
						<Link href="/">
							<Image
								src={LogoIcon}
								alt=""
								width={40}
								height={40}
							/>
						</Link>
						<Avatar
							alt={name}
							src={`https://${avatar}`}
							onClick={handleClick}
						/>
					</Stack>
				</Container>
				<Menu
					anchorEl={anchorEl}
					id="account-menu"
					open={open}
					onClose={handleClose}
					onClick={handleClose}
					PaperProps={{
						elevation: 0,
						sx: {
							overflow: 'visible',
							filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							mt: 1.5,
							'& .Avatar-root': {
								width: 32,
								height: 32,
								ml: -0.5,
								mr: 1,
							},
							'&:before': {
								content: '""',
								display: 'block',
								position: 'absolute',
								top: 0,
								right: 14,
								width: 10,
								height: 10,
								bgcolor: 'background.paper',
								transform: 'translateY(-50%) rotate(45deg)',
								zIndex: 0,
							},
						},
					}}
					transformOrigin={{ horizontal: 'right', vertical: 'top' }}
					anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
				>
					<Link
						passHref
						href="/user"
					>
						<MenuItem onClick={handleClose}>
							<ListItemIcon>
								<Person fontSize="small" />
							</ListItemIcon>
							Profile
						</MenuItem>
					</Link>
					<MenuItem onClick={handleCreateNewProject}>
						<ListItemIcon>
							<AddNewProject fontSize="small" />
						</ListItemIcon>
						Add New Project
					</MenuItem>
					<Divider />
					<MenuItem onClick={handleLogout}>
						<ListItemIcon>
							<Logout fontSize="small" />
						</ListItemIcon>
						Logout
					</MenuItem>
				</Menu>
			</AppBar>
			<NewProjectDialog isOpen={isNewProjectDialogOpen} onClose={handleCreateNewProject} />
		</>
	);
}
