"use client";

import { useTheme } from "next-themes";
import React, { useState, useEffect } from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;
	return (
		<div className="flex items-center">
			{theme === "dark" && (
				<SunIcon
					className="h-[1.2rem] w-[1.2rem] cursor-pointer"
					onClick={() => setTheme("light")}
				/>
			)}
			{theme === "light" && (
				<MoonIcon
					className="h-[1.2rem] w-[1.2rem] cursor-pointer"
					onClick={() => setTheme("dark")}
				/>
			)}
		</div>
	);
}

export default ThemeSwitcher;
