import './auth.scss';

import AuthBackground from '@/assets/svg/auth-background.svg';
import Image from 'next/image';

export default function AuthenticationRootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head />
			<body>
				<div className="auth-container">
					<div className="background">
						<Image
							src={AuthBackground}
							alt=""
							fill
						/>
					</div>
					<div className="form-container">{children}</div>
				</div>
			</body>
		</html>
	);
}
