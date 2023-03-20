'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ToolTip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import RefreshIcon from '@mui/icons-material/Refresh';
import BlacklistsList from './list';
import NewBlacklistDialog from './newBlacklist';
import { useRouter } from 'next/navigation';

type blacklistProp = {
	id: string;
	email: string;
	isActive: boolean;
	createdAt: string;
};

export default function BlacklistsTab({
    blacklists,
    projectId,
	value,
	index,
	...other
}: {
        blacklists: blacklistProp[];
    projectId: string,
	value: number;
	index: number;
} & any) {

    const router = useRouter();
    
	const [isNewBlacklistDialogOpen, setIsNewBlacklistDialogOpen] =
		useState(false);

	const handleCreateNewBlacklist = () => {
		setIsNewBlacklistDialogOpen(!isNewBlacklistDialogOpen);
	};

    const handleRefresh = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.refresh();
    }

	return (
		<>
			<div
				role="tabpanel"
				hidden={value !== index}
				id={`tabpanel-${index}`}
				aria-labelledby={`tab-${index}`}
				{...other}
			>
				{value === index && (
					<Box sx={{ p: 3 }}>
						<Stack
							direction="row"
							alignItems="center"
							justifyContent="flex-end"
                        >
                            <ToolTip title="Refresh">
                                <IconButton size="small" onClick={handleRefresh} sx={{mx: 2}}>
                                    <RefreshIcon />
                                </IconButton>
                            </ToolTip>
							<Button
								variant="contained"
								disableElevation
								size="small"
								onClick={handleCreateNewBlacklist}
								sx={{
									background: '#9BDD92',
									':hover': { background: '#B8E7B1' },
									px: 2,
									py: 1,
								}}
							>
								Create New
							</Button>
						</Stack>
						<BlacklistsList blacklists={blacklists} />
					</Box>
				)}
			</div>
			<NewBlacklistDialog
				isOpen={isNewBlacklistDialogOpen}
                onClose={handleCreateNewBlacklist}
                projectId={projectId}
			/>
		</>
	);
}
