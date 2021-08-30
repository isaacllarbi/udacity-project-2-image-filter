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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const util_1 = require("./util/util");
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Init the Express application
    const app = express_1.default();
    // Set the network port
    const port = process.env.PORT || 8082;
    // Use the body parser middleware for post requests
    app.use(body_parser_1.default.json());
    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.send("try GET /filteredimage?image_url={{}}");
    }));
    app.get("/filteredimage", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        //Extract image_url from HTTP request
        let { image_url } = req.query;
        //Validate the image_url query
        const urlIsValid = image_url != '' && (image_url.toString().includes("http://")
            || image_url.toString().includes("https://"));
        if (urlIsValid) {
            try {
                //call filterImageFromURL(image_url) to filter the image
                const file = yield util_1.filterImageFromURL(image_url.toString());
                //send the resulting file in the response
                // I got help on how to delete the file only after sending the response to the client from 
                // https://stackoverflow.com/questions/59759842/nodejs-file-get-deleted-before-sending-response-res-send
                res.status(200).sendFile(file, err => {
                    if (err) {
                        console.log(err);
                        res.status(500).send(`${err.message}`);
                    }
                    // delete file
                    let filesToDelete = [file];
                    util_1.deleteLocalFiles(filesToDelete);
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).send(`${error}`);
            }
        }
        else {
            res.status(422).send(`Bad url, Please provide an image url`);
        }
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
//# sourceMappingURL=server.js.map