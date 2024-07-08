"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLogTypeFromLevel = void 0;
const LogLevel_enum_1 = require("../logger/enums/LogLevel.enum");
const LogType_enum_1 = require("./enums/LogType.enum");
class GetLogTypeFromLevel {
    getLogType(logLevel) {
        switch (logLevel) {
            case LogLevel_enum_1.LogLevel.DEBUG:
                return LogType_enum_1.LogType.APPLICATION_LOG;
            case LogLevel_enum_1.LogLevel.INFO:
                return LogType_enum_1.LogType.APPLICATION_LOG;
            case LogLevel_enum_1.LogLevel.WARNING:
                return LogType_enum_1.LogType.APPLICATION_LOG;
            case LogLevel_enum_1.LogLevel.SILLY:
                return LogType_enum_1.LogType.APPLICATION_LOG;
            case LogLevel_enum_1.LogLevel.VERBOSE:
                return LogType_enum_1.LogType.APPLICATION_LOG;
            case LogLevel_enum_1.LogLevel.ERROR:
                return LogType_enum_1.LogType.ERROR_LOG;
            case LogLevel_enum_1.LogLevel.HTTP:
                return LogType_enum_1.LogType.ACCESS_LOG;
            default:
                throw new Error("Invalid Log Level: " + logLevel);
        }
    }
}
exports.GetLogTypeFromLevel = GetLogTypeFromLevel;
