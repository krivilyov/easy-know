"use server";

import {
	registrationFormSchema,
	registrationFormSchemaType,
} from "@/schemas/auth";

export async function registration(formData: FormData) {
	const data = Object.fromEntries(formData);
	const validatedFields = registrationFormSchema.safeParse(data);

	if (!validatedFields.success) {
		return { error: validatedFields.error.formErrors.fieldErrors };
	}
}
