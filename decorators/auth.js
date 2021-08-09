"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckAuthorization = void 0;
exports.CheckAuthorization = () => {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            if (!args[0].req.session.userId) {
                return null;
            }
            const result = originalMethod.apply(this, args);
            return result;
        };
    };
};
//# sourceMappingURL=auth.js.map