"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeImage = void 0;
exports.removeImage = (path) => {
    const fs = require('fs');
    fs.unlink(path, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
};
//# sourceMappingURL=fileHelpers.js.map