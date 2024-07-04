export interface UserData {
	id: string;
	email: string;
	password: string | null;
	role: "ADMIN" | "CUSTOMER";
	createdAt: Date;
	updatedAt: Date;
	companyId: string | null;
	banned: boolean;
}

export interface UserDataError {
	errors?: {
		email?: string[] | undefined;
		password?: string[] | undefined;
		confirmPassword?: string[] | undefined;
		pin?: string[] | undefined;
	};
}

export interface SetPinResponseData {
	error?: boolean;
	success: boolean;
}

export interface SpaceData {
	id: number;
	slug: string;
	name: string;
	description: string;
	createdAt?: Date;
	updatedAt?: Date;
	banned?: boolean;
}
