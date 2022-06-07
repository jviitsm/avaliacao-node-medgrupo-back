"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAge = (birthday) => {
    const date = new Date();
    const ageDifMs = date.getTime() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (age < 18) {
        return false;
    }
    return true;
};
