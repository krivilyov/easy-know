"use client";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	registrationFormSchema,
	registrationFormSchemaType,
} from "@/schemas/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImSpinner2 } from "react-icons/im";
import { registration } from "@/actions/auth";
import { UserData, UserDataError } from "@/helpers/models";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoEye, GoEyeClosed } from "react-icons/go";

export default function RegistrationForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<registrationFormSchemaType>({
		resolver: zodResolver(registrationFormSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onFormSubmit = async (values: registrationFormSchemaType) => {
		setIsLoading(true);
		const data = new FormData();
		data.append("email", values.email);
		data.append("password", values.password);
		data.append("confirmPassword", values.confirmPassword);

		const user = await registration(data);
		setIsLoading(false);
		//если вернулись ошибки
		const errors = user.errors;

		if (errors) {
			if (errors.email && errors.email.length > 0) {
				let errorStr = "";
				errors.email.forEach((error: string) => {
					errorStr += error + ". ";
				});

				form.setError("email", { type: "server", message: errorStr });
			}

			if (errors.password && errors.password.length > 0) {
				let errorStr = "";
				errors.password.forEach((error: string) => {
					errorStr += error + ". ";
				});

				form.setError("password", { type: "server", message: errorStr });
			}

			if (errors.confirmPassword && errors.confirmPassword.length > 0) {
				let errorStr = "";
				errors.confirmPassword.forEach((error: string) => {
					errorStr += error + ". ";
				});

				form.setError("confirmPassword", { type: "server", message: errorStr });
			}
		}

		if (user.data) {
			localStorage.setItem("userEmail", user.data.email);
			router.push("/login");
		}
	};

	return (
		<div className="w-full 2sm:w-[350px] space-y-4">
			<h1 className="text-2xl font-bold text-center">Регистрация</h1>
			<div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onFormSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Email"
											{...field}
											disabled={isLoading}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className="relative">
											<Input
												type={showPassword ? "text" : "password"}
												placeholder="Пароль"
												disabled={isLoading}
												{...field}
											/>
											<Button
												variant={"ghost"}
												size="sm"
												className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={(e) => {
													e.preventDefault();
													setShowPassword((prev) => !prev);
												}}
											>
												{showPassword ? <GoEye /> : <GoEyeClosed />}
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className="relative">
											<Input
												type={showPassword ? "text" : "password"}
												placeholder="Подтвердите пароль"
												{...field}
											/>
											<Button
												variant={"ghost"}
												size="sm"
												className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={(e) => {
													e.preventDefault();
													setShowPassword((prev) => !prev);
												}}
											>
												{showPassword ? <GoEye /> : <GoEyeClosed />}
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							onClick={form.handleSubmit(onFormSubmit)}
							disabled={form.formState.isSubmitting}
							className="w-full mt-4"
						>
							{!isLoading && <span>Зарегистрироваться</span>}
							{isLoading && <ImSpinner2 className="animate-spin" />}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
