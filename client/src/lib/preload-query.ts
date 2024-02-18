import { convex } from '@/lib/providers/ConvexProvider';
import { Preloaded } from 'convex/react';
import {
	FunctionArgs,
	FunctionReference,
	getFunctionName,
} from 'convex/server';
import { convexToJson } from 'convex/values';

export const preloadQuery = async <
	TQuery extends FunctionReference<'query'>,
	TArgs extends FunctionArgs<TQuery>,
>(
	query: TQuery,
	args: TArgs,
) =>
	({
		_name: getFunctionName(query),
		_argsJSON: convexToJson(args),
		_valueJSON: convexToJson(await convex.query(query, args)),
	}) as Preloaded<TQuery>;
