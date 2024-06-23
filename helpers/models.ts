export interface UserData {
	id: string;
	email: string;
	password: string | null;
	role: "ADMIN" | "CUSTOMER";
	createdAt: Date;
	updatedAt: Date;
	companyId: string | null;
	banned: boolean;
	error?: {
		email?: string[] | undefined;
	};
}

export interface UserDataError {
	error?: {
		email?: string[] | undefined;
		pin?: string[] | undefined;
	};
}

export interface SetPinResponseData {
	error?: boolean;
	success: boolean;
}
