'use client';

import Lottie from 'lottie-react';
import LoadingAnimation from '@/assets/animations/loading-shapes.json';

export default function CompleteLoginPage() {
	return (
		<>
			<h1>Login process complete</h1>
			<h3 style={{textAlign: "center", marginTop: "20px"}}>Magic link has been sent to your email address</h3>
			<div className="alert-container">
				<Lottie
					animationData={LoadingAnimation}
					loop={true}
				/>
			</div>
		</>
	);
}
