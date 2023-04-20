"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const const_1 = require("./const");
const fetch_1 = require("./fetch");
const EMAIL_REG = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const ABSTRACT_URL = `https://emailvalidation.abstractapi.com/v1/?api_key=${const_1.ABSTRACT.KEY}`;
function default_1(email, isProd) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email.match(EMAIL_REG)) {
            return false;
        }
        // we don't waste our calls on dev
        if (isProd) {
            let url = `${ABSTRACT_URL}&email=${email}`;
            let data;
            let parsed;
            try {
                data = yield (0, fetch_1.GET)(url);
                parsed = JSON.parse(data.toString());
            }
            catch (_a) {
                return false;
            }
            if ((parsed === null || parsed === void 0 ? void 0 : parsed.deliverability) !== "DELIVERABLE")
                return false;
        }
        return true;
    });
}
exports.default = default_1;
