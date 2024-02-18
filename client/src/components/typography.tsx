import { cn } from '@/lib/utils';
import { FC, PropsWithChildren } from 'react';

export const TypographyH1: FC<PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => {
	return (
		<h1
			className={cn(
				'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
				className,
			)}
		>
			{children}
		</h1>
	);
};
