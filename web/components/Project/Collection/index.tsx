'use client';

import Box from '@mui/material/Box';
import CollectionsList from "./list"

type collectionProp = {
	id: string;
	username: string;
	email: string;
	isActive: boolean;
	createdAt: string;
};

export default function CollectionsTab({
	collections,
	value,
	index,
	...other
}: {
	collections: collectionProp[];
	value: number;
	index: number;
} & any) {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`tabpanel-${index}`}
			aria-labelledby={`tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<CollectionsList collections={collections} />
				</Box>
			)}
		</div>
	);
}
