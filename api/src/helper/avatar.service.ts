import { Injectable } from '@nestjs/common';
import { createAvatar } from '@dicebear/avatars';
import * as style from "@dicebear/big-ears-neutral";

@Injectable()
export class AvatarService {
	createAvatar(username: string) {
		const svg = createAvatar(style, {
			seed: username,
		});
		return svg;
	}
}
