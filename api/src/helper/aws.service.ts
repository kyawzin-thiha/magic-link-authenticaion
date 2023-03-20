import { Injectable } from '@nestjs/common';
import {
	DeleteObjectCommand,
	DeleteObjectsCommand,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import type { S3Client as S3ClientType } from '@aws-sdk/client-s3';
import { ErrorDto } from 'src/types/error.dto';

@Injectable()
export class AwsService {
	constructor() {
		this.s3Client = new S3Client({
			region: process.env.AWS_REGION,
			apiVersion: '2006-03-01',
		});
	}
	private s3Client: S3ClientType;

	async uploadFile(
		username: string,
		file: Express.Multer.File,
		fileName?: string,
	): Promise<[{ url: string, key: string } | null, ErrorDto]> {
		const params = {
			Bucket: process.env.AWS_BUCKET,
			Key: `${process.env.AWS_S3_FOLDER_PATH}/${username}/${fileName ? fileName : file.originalname.replace(/ /g, '_')
				}`,
			Body: file.buffer,
			ContentType: file.mimetype,
		};

		try {
			await this.s3Client.send(new PutObjectCommand(params));
		} catch (error) {
			return [null, { message: 'Server Error', statusCode: 500 }];
		} finally {
			const data = {
				url: `${process.env.AWS_S3_DOMAIN}/${params.Key}`,
				key: params.Key,
			}
			return [data, null];
		}
	}

	async uploadString(
		username: string,
		fileName: string,
		fileString: string,
		type: string,
	): Promise<[{ url: string, key: string } | null, ErrorDto]> {
		const params = {
			Bucket: process.env.AWS_BUCKET,
			Key: `${process.env.AWS_S3_FOLDER_PATH}/${username}/${fileName}`,
			Body: fileString,
			ContentType: type,
		};
		try {
			await this.s3Client.send(new PutObjectCommand(params));
		} catch (error) {
			return [null, { message: 'Server Error', statusCode: 500 }];
		} finally {
			const data = {
				url: `${process.env.AWS_S3_DOMAIN}/${params.Key}`,
				key: params.Key,
			}
			return [data, null];
		}
	}

	async deleteFile(fileKey: string): Promise<ErrorDto> {
		const params = {
			Bucket: process.env.AWS_BUCKET,
			Key: fileKey,
		};

		try {
			await this.s3Client.send(new DeleteObjectCommand(params));
			return null;
		} catch (error) {
			return { message: 'Server Error', statusCode: 500 };
		}
	}

	async deleteFiles(fileKeys: string[]): Promise<ErrorDto> {
		const params = {
			Bucket: process.env.AWS_BUCKET,
			Delete: {
				Objects: fileKeys.map((key) => ({ Key: key })),
			},
		};

		try {
			await this.s3Client.send(new DeleteObjectsCommand(params));
			return null;
		} catch (error) {
			return { message: 'Server Error', statusCode: 500 };
		}
	}
}
