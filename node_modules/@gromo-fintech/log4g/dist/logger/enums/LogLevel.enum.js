"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "error";
    LogLevel["WARNING"] = "warn";
    LogLevel["INFO"] = "info";
    LogLevel["HTTP"] = "http";
    LogLevel["VERBOSE"] = "verbose";
    LogLevel["DEBUG"] = "debug";
    LogLevel["SILLY"] = "silly";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
