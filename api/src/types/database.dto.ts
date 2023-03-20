import { Account, Blacklist, Collection, Credential, Project, User } from "@prisma/client";

export type AccountWithUserDto = Account & { user: User } | null;

export type UserDto = User | null;
export type UserWithProjectsDto = User & { projects: Project[] } | null;

export type ProjectDto = Project & { owner: User, credentials: Credential } | null;
export type ProjectWithCollectionsDto = Project & { owner: User, credentials: Credential, collections: Collection[], blacklists: Blacklist[] } | null;

export type CollectionDto = Collection & { project: Project } | null;
export type CollectionsDto = (Collection & { project: Project })[] | null;

export type BlacklistDto = Blacklist & { project: Project } | null;
export type BlacklistsDto = (Blacklist & { project: Project })[] | null;