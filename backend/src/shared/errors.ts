import HttpStatusCodes from 'http-status-codes';


export abstract class CustomError extends Error {

    public readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;

    constructor(msg: string, httpStatus: number) {
        super(msg);
        this.HttpStatus = httpStatus;
    }
}


export class ParamMissingError extends CustomError {

    public static readonly Msg = 'One or more of the required parameters was missing.';
    public static readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;

    constructor() {
        super(ParamMissingError.Msg, ParamMissingError.HttpStatus);
    }
}


export class UploadFileMissingError extends CustomError {
    public static readonly Msg = 'No file has been uploaded.';
    public static readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;

    constructor() {
        super(UploadFileMissingError.Msg, UploadFileMissingError.HttpStatus);
    }
}

export class MalformedDataFileError extends CustomError {
    public static readonly Msg = 'Provided file contains malformed data.';
    public static readonly HttpStatus = HttpStatusCodes.BAD_REQUEST

    constructor() {
        super(MalformedDataFileError.Msg, MalformedDataFileError.HttpStatus);
    }
}

export class UserNotFoundError extends CustomError {
    public static readonly Msg = '';
    public static readonly HttpStatus = HttpStatusCodes.BAD_REQUEST;

    constructor() {
        super(UserNotFoundError.Msg, UserNotFoundError.HttpStatus);
    }
}
