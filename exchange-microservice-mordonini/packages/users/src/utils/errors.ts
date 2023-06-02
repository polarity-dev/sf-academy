import { onError } from "protocat"
import logger from "./logger"

enum Code {
    OK,
    CANCELED,
    UNKNOWN,
    INVALID_ARGUMENT,
    DEADLINE_EXCEEDED,
    NOT_FOUND,
    ALREADY_EXISTS,
    PERMISSION_DENIED,
    RESOURCE_EXHAUSTED,
    FAILED_PRECONDITION,
    ABORTED,
    OUT_OF_RANGE,
    UNIMPLEMENTED,
    INTERNAL,
    DATA_LOSS,
    UNAVAILABLE,
    UNAUTHENTICATED
}

/**
 * Base error
 */
export class NotifyUserError extends Error{
    code: number = Code.UNKNOWN
    description = ''

    /**
     * 
     * @param message Text to show to the user
     * @param description Text to be logged
     */
    constructor(message: string, description = ''){
        super(message)

        this.description = message+' '+description
        Object.setPrototypeOf(this, NotifyUserError.prototype)
    }
}

/***** BASE ERRORS *****/
export class CanceledError      extends NotifyUserError{ code: number = Code.CANCELED }
export class UnknownError       extends NotifyUserError{ code: number = Code.UNKNOWN }
export class InvalidArgument    extends NotifyUserError{ code: number = Code.INVALID_ARGUMENT  }
export class DeadlineExceeded   extends NotifyUserError{ code: number = Code.DEADLINE_EXCEEDED }
export class NotFoundError      extends NotifyUserError{ code: number = Code.NOT_FOUND }
export class AlreadyExistsError extends NotifyUserError{ code: number = Code.ALREADY_EXISTS }
export class PermissionDenied   extends NotifyUserError{ code: number = Code.PERMISSION_DENIED }
export class ResourceExhausted  extends NotifyUserError{ code: number = Code.RESOURCE_EXHAUSTED }
export class FailedPrecondition extends NotifyUserError{ code: number = Code.FAILED_PRECONDITION }
export class AbortedError       extends NotifyUserError{ code: number = Code.ABORTED }
export class OutOfRangeError    extends NotifyUserError{ code: number = Code.OUT_OF_RANGE }
export class UnimplementedError extends NotifyUserError{ code: number = Code.UNIMPLEMENTED }
export class InternalError      extends NotifyUserError{ code: number = Code.INTERNAL }
export class DataLossError      extends NotifyUserError{ code: number = Code.DATA_LOSS }
export class UnavailableError   extends NotifyUserError{ code: number = Code.UNAVAILABLE }
export class UnauthenticatedError    extends NotifyUserError{ code: number = Code.UNAUTHENTICATED }


/***** CUSTOM ERRORS *****/

/* Error while using exchange service */
export class ExchangeError extends InternalError{}

/* Duplicate unique fields */
export class EmailAlreadyPresent extends AlreadyExistsError{}
export class AccountAlreadyPresent extends AlreadyExistsError{}

/* INVALID PARAMETERS */
export class IBANAlreadyPresent extends InvalidArgument{}
export class IBANNotFound extends InvalidArgument {}

/* CURRENCY ERROR */
export class NotEnoughtCurrency extends AbortedError{}

/* AUTHENTICATION */
export class InvalidCredentials extends NotFoundError{}
export class InvalidToken extends UnauthenticatedError{}
export class TokenValidityExpired extends UnauthenticatedError{}
export class InvalidPermissions extends PermissionDenied{}

/**
 * Logs the error message and forward to the client
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = onError((e, call) => {
    if (e instanceof NotifyUserError)   {
        logger.warn(e.description, {
            code: e.code,
            message: e.message,
            description: e.description,
            stack: e.stack
        })
        throw e
    }
    else {
        logger.error(JSON.stringify(e))
        throw new InternalError(`Unknown internal error`)
    }
})