"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    template: {
        getDevDataUrl(path) {
            return path.replace(/\\/g, '/');
        }
    }
};
