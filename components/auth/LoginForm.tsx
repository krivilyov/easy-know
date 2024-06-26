"use client";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ImSpinner2 } from "react-icons/im";
import {
	loginFormOnlyEmailSchema,
	loginFormOnlyEmailSchemaType,
	loginFormWithPinSchema,
	loginFormWithPinSchemaType,
	loginFormWithPasswordSchemaType,
	loginFormWithPasswordSchema,
} from "@/schemas/auth";
import { loginWithPassword, loginWithPin, setPin } from "@/actions/auth";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function LoginForm() {
	const { toast } = useToast();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [userEmail, setUserEmail] = useState<string | null>(null);
	const [typeLoginForm, setTypeLoginForm] = useState<
		"withPin" | "withPassword" | null
	>(null);

	const formOnlyEmail = useForm<loginFormOnlyEmailSchemaType>({
		resolver: zodResolver(loginFormOnlyEmailSchema),
		defaultValues: {
			email: "",
		},
	});

	const formForPinAuth = useForm<loginFormWithPinSchemaType>({
		resolver: zodResolver(loginFormWithPinSchema),
		defaultValues: {
			email: "",
			pin: "",
		},
	});

	const formForPasswordAuth = useForm<loginFormWithPasswordSchemaType>({
		resolver: zodResolver(loginFormWithPasswordSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		const email = localStorage.getItem("userEmail");
		if (email) {
			setUserEmail(email);
			setTypeLoginForm("withPin");
			formForPinAuth.setValue("email", email);
		}
	}, []);

	const onFormOnlyEmailSubmit = async (
		values: loginFormOnlyEmailSchemaType
	) => {
		console.log(values);
		setIsLoading(true);
		const data = new FormData();
		data.append("email", values.email);

		const setPinResult = await setPin(data);

		setIsLoading(false);

		if (setPinResult.error) {
			if (setPinResult.error.email && setPinResult.error.email.length > 0) {
				let errors = "";
				setPinResult.error.email.forEach((error: string) => {
					errors += error + ". ";
				});

				formOnlyEmail.setError("email", { type: "server", message: errors });
			}
		}

		if (!setPinResult.success && !setPinResult.error) {
			toast({
				variant: "destructive",
				title: "Ошибка",
				description: "Что-то пошло не так",
			});
		}

		if (setPinResult.success) {
			localStorage.setItem("userEmail", values.email);
			setUserEmail(values.email);
			setTypeLoginForm("withPin");
			formForPinAuth.setValue("email", values.email);
		}
	};

	useEffect(() => {
		const email = userEmail ? userEmail : "";

		if (!typeLoginForm) {
			formOnlyEmail.setValue("email", email);
		}

		if (typeLoginForm === "withPin") {
			formForPinAuth.setValue("email", email);
		}

		if (typeLoginForm === "withPassword") {
			formForPasswordAuth.setValue("email", email);
		}
	}, [
		typeLoginForm,
		formOnlyEmail,
		formForPinAuth,
		formForPasswordAuth,
		userEmail,
	]);

	const onFormForPinAuthSubmit = async (values: loginFormWithPinSchemaType) => {
		console.log("pin", values);
		setIsLoading(true);
		const data = new FormData();
		data.append("email", values.email);
		data.append("pin", values.pin);

		const user = await loginWithPin(data);
		const errors = user.errors;
		setIsLoading(false);
		if (errors) {
			if (errors.email && errors.email.length > 0) {
				let errorStr = "";
				errors.email.forEach((error: string) => {
					errorStr += error + ". ";
				});

				formForPinAuth.setError("email", { type: "server", message: errorStr });
			}

			if (errors.pin && errors.pin.length > 0) {
				let errorStr = "";
				errors.pin.forEach((error: string) => {
					errorStr += error + ". ";
				});

				formForPinAuth.setError("pin", { type: "server", message: errorStr });
			}
		}

		if (user.data) {
			localStorage.removeItem("userEmail");
			router.push("/");
		}
	};

	const onFormForPasswordSubmit = async (
		values: loginFormWithPasswordSchemaType
	) => {
		console.log("password", values);
		setIsLoading(true);
		const data = new FormData();
		data.append("email", values.email);
		data.append("password", values.password);

		const user = await loginWithPassword(data);
		const errors = user.errors;

		setIsLoading(false);
		if (errors) {
			if (errors.email && errors.email.length > 0) {
				let errorStr = "";
				errors.email.forEach((error: string) => {
					errorStr += error + ". ";
				});

				formForPasswordAuth.setError("email", {
					type: "server",
					message: errorStr,
				});
			}

			if (errors.password && errors.password.length > 0) {
				let errorStr = "";
				errors.password.forEach((error: string) => {
					errorStr += error + ". ";
				});

				formForPasswordAuth.setError("password", {
					type: "server",
					message: errorStr,
				});
			}
		}

		if (user.data) {
			localStorage.removeItem("userEmail");
			router.push("/");
		}
	};

	return (
		<div className="w-full 2sm:w-[350px] space-y-4">
			<h1 className="text-2xl font-bold text-center">Войти</h1>
			<div className="space-y-4">
				{!typeLoginForm && (
					<>
						<Form {...formOnlyEmail}>
							<form
								onSubmit={formOnlyEmail.handleSubmit(onFormOnlyEmailSubmit)}
								className="space-y-4"
							>
								<FormField
									control={formOnlyEmail.control}
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
											<FormDescription>
												Использовать{" "}
												<span
													className="font-bold text-primary cursor-pointer"
													onClick={() => setTypeLoginForm("withPassword")}
												>
													пароль
												</span>{" "}
												для входа
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</form>
						</Form>

						<Button
							onClick={formOnlyEmail.handleSubmit(onFormOnlyEmailSubmit)}
							disabled={formOnlyEmail.formState.isSubmitting}
							className="w-full mt-4"
						>
							{!isLoading && <span>Войти</span>}
							{isLoading && <ImSpinner2 className="animate-spin" />}
						</Button>
					</>
				)}

				{typeLoginForm === "withPin" && (
					<>
						<Form {...formForPinAuth}>
							<form
								onSubmit={formForPinAuth.handleSubmit(onFormForPinAuthSubmit)}
								className="space-y-4"
							>
								<FormField
									control={formForPinAuth.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input placeholder="Email" {...field} disabled={true} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={formForPinAuth.control}
									name="pin"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													placeholder="PIN"
													{...field}
													disabled={isLoading}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</form>
						</Form>

						<Button
							onClick={formForPinAuth.handleSubmit(onFormForPinAuthSubmit)}
							disabled={formForPinAuth.formState.isSubmitting}
							className="w-full mt-4"
						>
							{!isLoading && <span>Войти</span>}
							{isLoading && <ImSpinner2 className="animate-spin" />}
						</Button>
						<Button
							variant="outline"
							className="w-full mt-4"
							onClick={() => setTypeLoginForm(null)}
						>
							Отменить
						</Button>
					</>
				)}

				{typeLoginForm === "withPassword" && (
					<>
						<Form {...formForPasswordAuth}>
							<form
								onSubmit={formForPasswordAuth.handleSubmit(
									onFormForPasswordSubmit
								)}
								className="space-y-4"
							>
								<FormField
									control={formForPasswordAuth.control}
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
									control={formForPasswordAuth.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type="password"
													placeholder="Password"
													{...field}
													disabled={isLoading}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</form>
						</Form>

						<Button
							onClick={formForPasswordAuth.handleSubmit(
								onFormForPasswordSubmit
							)}
							disabled={formOnlyEmail.formState.isSubmitting}
							className="w-full mt-4"
						>
							{!isLoading && <span>Войти</span>}
							{isLoading && <ImSpinner2 className="animate-spin" />}
						</Button>
						<Button
							variant="outline"
							className="w-full mt-4"
							onClick={() => setTypeLoginForm(null)}
						>
							Отменить
						</Button>
					</>
				)}
			</div>
		</div>
	);
}
