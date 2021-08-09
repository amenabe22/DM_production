"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileResolver = exports.storeUpload = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const shortid_1 = require("shortid");
const classifyNude_1 = require("../utils/classifyNude");
const fileHelpers_1 = require("../utils/fileHelpers");
const type_graphql_1 = require("type-graphql");
const user_1 = require("../entities/user");
const graphql_upload_1 = require("graphql-upload");
const photos_1 = require("../entities/photos");
const decorators_1 = require("../decorators");
exports.storeUpload = ({ stream, filename, mimetype }) => {
    const id = shortid_1.generate();
    const path = `media/${id}-${filename}`;
    return new Promise((resolve, reject) => stream
        .pipe(fs_1.default.createWriteStream(path))
        .on("finish", () => resolve({ id, path, filename, mimetype }))
        .on("error", reject));
};
let ProfileResolver = class ProfileResolver {
    cleanNude(cleanPath, req, file, mass) {
        classifyNude_1.classifyNude(cleanPath, (hasNudity) => {
            if (hasNudity) {
                fileHelpers_1.removeImage(cleanPath);
                if (mass) {
                    photos_1.ProfilePic.create({
                        image: "gk.png",
                        user: req.session.userId
                    }).save();
                }
                else {
                    user_1.User.createQueryBuilder().update().set({
                        profilePic: "gk.png"
                    }).where("id = :id", {
                        id: req.session.userId
                    }).execute();
                }
            }
            else {
                if (mass) {
                    photos_1.ProfilePic.create({
                        image: file.path.substr(6),
                        user: req.session.userId
                    }).save();
                }
                else {
                    user_1.User.createQueryBuilder().update().set({
                        profilePic: file.path.substr(6)
                    }).where("id = :id", {
                        id: req.session.userId
                    }).execute();
                }
            }
        });
        return true;
    }
    updateProfilePic({ req }, { createReadStream, filename, mimetype }) {
        return __awaiter(this, void 0, void 0, function* () {
            const stream = createReadStream();
            stream.on('error', function (err) {
                console.warn(err);
            });
            const file = yield exports.storeUpload({ stream, filename, mimetype });
            const cleanPath = path_1.default.join(__dirname, '../../' + file.path);
            this.cleanNude(cleanPath, req, file, false);
            return true;
        });
    }
    ;
    addProfilePics({ req }, files) {
        return __awaiter(this, void 0, void 0, function* () {
            files.forEach(file => {
                file.then((fObj) => __awaiter(this, void 0, void 0, function* () {
                    const { createReadStream, filename, mimetype } = fObj;
                    const stream = createReadStream();
                    const stored_file = yield exports.storeUpload({ stream, filename, mimetype });
                    const cleanPath = path_1.default.join(__dirname, '../../' + stored_file.path);
                    this.cleanNude(cleanPath, req, stored_file, true);
                }));
            });
            return true;
        });
    }
    removePhoto({ req }, pic) {
        return __awaiter(this, void 0, void 0, function* () {
            photos_1.ProfilePic.delete({
                id: pic, user: req.session.userId
            });
            return true;
        });
    }
};
__decorate([
    decorators_1.CheckAuthorization(),
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("file", () => graphql_upload_1.GraphQLUpload)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileResolver.prototype, "updateProfilePic", null);
__decorate([
    decorators_1.CheckAuthorization(),
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("files", () => [graphql_upload_1.GraphQLUpload])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], ProfileResolver.prototype, "addProfilePics", null);
__decorate([
    decorators_1.CheckAuthorization(),
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __param(1, type_graphql_1.Arg("pic", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ProfileResolver.prototype, "removePhoto", null);
ProfileResolver = __decorate([
    type_graphql_1.Resolver(user_1.User)
], ProfileResolver);
exports.ProfileResolver = ProfileResolver;
;
//# sourceMappingURL=profile.js.map