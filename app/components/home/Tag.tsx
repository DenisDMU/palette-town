import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export default function Tag(props: HTMLAttributes<HTMLDivElement>) {
	const { className, children, ...otherProps } = props;
	return (
		<div
			className={twMerge(
				"inline-flex border border-primary gap-2 text-primary px-3 py-1 rounded-full uppercase items-center",
				className
			)}
			{...otherProps}
		>
			<span>💡</span>
			<span className="text-sm">{children}</span>
		</div>
	);
}
