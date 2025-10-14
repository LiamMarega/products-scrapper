import { ArgumentsHost, ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';
import { GraphQLResolveInfo } from 'graphql';
export type RestContext = {
    req: Request;
    res: Response;
    isGraphQL: false;
    info: undefined;
};
export type GraphQLContext = {
    req: Request;
    res: Response;
    isGraphQL: true;
    info: GraphQLResolveInfo;
};
/**
 * Parses in the Nest ExecutionContext of the incoming request, accounting for both
 * GraphQL & REST requests.
 */
export declare function parseContext(context: ExecutionContext | ArgumentsHost): RestContext | GraphQLContext;
