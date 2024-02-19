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

export const TypographyH2: FC<PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => {
	return (
		<h2
			className={cn(
				'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
				className,
			)}
		>
			{children}
		</h2>
	);
};

export const TypographyH3: FC<PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => {
	return (
		<h3
			className={cn(
				'scroll-m-20 text-2xl font-semibold tracking-tight',
				className,
			)}
		>
			{children}
		</h3>
	);
};

export const TypographyH4: FC<PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => {
	return (
		<h4
			className={cn(
				'scroll-m-20 text-xl font-semibold tracking-tight',
				className,
			)}
		>
			{children}
		</h4>
	);
};

export const TypographyParagraph: FC<
	PropsWithChildren<{ className?: string }>
> = ({ children, className }) => {
	return (
		<p className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}>
			{children}
		</p>
	);
};

export const TypographyLead: FC<PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => {
	return (
		<p className={cn('text-xl text-muted-foreground', className)}>{children}</p>
	);
};

export const TypographyLarge: FC<PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => {
	return (
		<div className={cn('text-lg font-semibold', className)}>{children}</div>
	);
};

export const TypographySmall: FC<PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => {
	return (
		<small className={cn('text-sm font-medium leading-none', className)}>
			{children}
		</small>
	);
};

export const TypographyMuted: FC<PropsWithChildren<{ className?: string }>> = ({
	children,
	className,
}) => {
	return (
		<p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
	);
};
