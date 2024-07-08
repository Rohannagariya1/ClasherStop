"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHelper = void 0;
class ErrorHelper {
    getStackTrace() {
        try {
            throw new Error();
        }
        catch (e) {
            return e;
        }
    }
}
exports.ErrorHelper = ErrorHelper;
