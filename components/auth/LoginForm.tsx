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
	loginFormEmailSchema,
	loginFormEmailSchemaType,
	loginFormPinSchema,
	loginFormPinSchemaType,
} from "@/schemas/auth";
import { login, setPin } from "@/actions/auth";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function LoginForm() {
	const { toast } = useToast();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [userEmail, setUserEmail] = useState<string | null>(null);
	const [isShowPinForm, setIsShowPinForm] = useState(false);

	const emailForm = useForm<loginFormEmailSchemaType>({
		resolver: zodResolver(loginFormEmailSchema),
		defaultValues: {
			email: "",
		},
	});

	const pinForm = useForm<loginFormPinSchemaType>({
		resolver: zodResolver(loginFormPinSchema),
		defaultValues: {
			pin: "",
		},
	});

	useEffect(() => {
		const email = localStorage.getItem("userEmail");
		if (email) {
			setUserEmail(email);
			emailForm.setValue("email", email);
			setIsShowPinForm(true);
		}
	}, []);

	const onFormEmailSubmit = async (values: loginFormEmailSchemaType) => {
		const data = new FormData();
		data.append("email", values.email);

		const setPinResult = await setPin(data);

		if (setPinResult.error) {
			if (setPinResult.error.email && setPinResult.error.email.length > 0) {
				let errors = "";
				setPinResult.error.email.forEach((error: string) => {
					errors += error + ". ";
				});

				emailForm.setError("email", { type: "server", message: errors });
			}
		}

		if (!setPinResult.success) {
			toast({
				variant: "destructive",
				title: "Ошибка",
				description: "Что-то пошло не так",
			});
		}

		if (setPinResult.success) {
			localStorage.setItem("userEmail", values.email);
			setIsShowPinForm(true);
		}
	};

	const onFormPinSubmit = async (values: loginFormPinSchemaType) => {
		const data = new FormData();
		if (userEmail) {
			data.append("email", userEmail);
		}
		data.append("pin", values.pin);

		const user = await login(data);
		const errors = user.errors;

		if (errors) {
			if (errors.pin && errors.pin.length > 0) {
				let errorsStr = "";
				errors.pin.forEach((error: string) => {
					errorsStr += errorsStr + ". ";
				});

				pinForm.setError("pin", { type: "server", message: errorsStr });
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
				<Form {...emailForm}>
					<form
						onSubmit={emailForm.handleSubmit(onFormEmailSubmit)}
						className="space-y-4"
					>
						<FormField
							control={emailForm.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											placeholder="Email"
											{...field}
											disabled={isLoading || !!userEmail}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
				{isShowPinForm && (
					<Form {...pinForm}>
						<form
							onSubmit={pinForm.handleSubmit(onFormPinSubmit)}
							className="space-y-4"
						>
							<FormField
								control={pinForm.control}
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
										<FormDescription>
											На указанную почту, было отправлено письмо с PIN для
											авторизации
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
				)}

				{!isShowPinForm && (
					<Button
						onClick={emailForm.handleSubmit(onFormEmailSubmit)}
						disabled={emailForm.formState.isSubmitting}
						className="w-full mt-4"
					>
						{!isLoading && <span>Войти</span>}
						{isLoading && <ImSpinner2 className="animate-spin" />}
					</Button>
				)}

				{isShowPinForm && (
					<Button
						onClick={pinForm.handleSubmit(onFormPinSubmit)}
						disabled={pinForm.formState.isSubmitting}
						className="w-full mt-4"
					>
						{!isLoading && <span>Войти</span>}
						{isLoading && <ImSpinner2 className="animate-spin" />}
					</Button>
				)}
			</div>
		</div>
	);
}
