export declare enum ErrorCode {
    UNKNOWN_OPTIONS = "UNKNOWN_OPTIONS",
    REQUIRED_OPTIONS = "REQUIRED_OPTIONS",
    NOT_ENOUGH_ARGUMENTS = "NOT_ENOUGH_ARGUMENTS",
    COMMAND_IS_NOT_FOUND = "COMMAND_IS_NOT_FOUND",
    COMMAND_IS_NOT_IMPLEMENT = "COMMAND_IS_NOT_IMPLEMENT",
    COMMAND_IS_CONFLICT = "COMMAND_IS_CONFLICT",
    UNKNOWN = "UNKNOWN"
}
export declare class ArtusCliError extends Error {
    code: ErrorCode;
    static create(code: ErrorCode, message: string, ...args: any[]): ArtusCliError;
}
export declare const errors: {
    unknown_options(options: string[]): ArtusCliError;
    required_options(options: string[]): ArtusCliError;
    not_enough_argumnents(requiredArgv: string[]): ArtusCliError;
    command_is_not_found(commandInfo: string): ArtusCliError;
    command_is_not_implement(commandInfo: string): ArtusCliError;
    command_is_conflict(command: string, existsCommandName: string, existsCommandLocation: string | undefined, conflictCommandName: string, conflictCommandLocation: string | undefined): ArtusCliError;
    unknown(message: string): ArtusCliError;
};
