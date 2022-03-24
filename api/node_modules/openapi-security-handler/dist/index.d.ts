import { OpenAPI, OpenAPIV2, OpenAPIV3 } from 'openapi-types';
export interface IOpenAPISecurityHandler {
    handle(request: OpenAPI.Request): Promise<void>;
}
export interface OpenAPISecurityHandlerArgs {
    loggingKey: string;
    operationSecurity: (OpenAPIV2.SecurityRequirementObject | OpenAPIV3.SecurityRequirementObject)[];
    securityDefinitions: OpenAPIV2.SecurityDefinitionsObject | {
        [index: string]: OpenAPIV3.SecuritySchemeObject;
    };
    securityHandlers: SecurityHandlers;
}
export interface SecurityHandlers {
    [name: string]: SecurityHandler;
}
export declare type SecurityScope = string;
export declare type SecurityHandler = (req: OpenAPI.Request, scopes: SecurityScope[], definition: OpenAPIV2.SecuritySchemeObject | OpenAPIV3.SecuritySchemeObject) => Promise<boolean> | boolean;
export default class OpenAPISecurityHandler implements IOpenAPISecurityHandler {
    private operationSecurity;
    private securitySets;
    constructor(args: OpenAPISecurityHandlerArgs);
    handle(request: any): Promise<void>;
}
