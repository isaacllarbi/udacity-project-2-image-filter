import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  app.get("/filteredimage", async (req, res) => {
    //Extract image_url from HTTP request
    let { image_url } = req.query;

    //Validate the image_url query
    const urlIsValid: boolean = image_url != '' && (image_url.toString().includes("http://")
      || image_url.toString().includes("https://"));

    if (urlIsValid) {
      try {
        //call filterImageFromURL(image_url) to filter the image
        const file: string = await filterImageFromURL(image_url.toString())

        //send the resulting file in the response
        // I got help on how to delete the file only after sending the response to the client from 
        // https://stackoverflow.com/questions/59759842/nodejs-file-get-deleted-before-sending-response-res-send
        res.status(200).sendFile(file, err => {
          if (err) {
            console.log(err);
            res.status(500).send(`${err.message}`);
          }

          // delete file
          let filesToDelete: string[] = [file];
          deleteLocalFiles(filesToDelete)
        });

      } catch (error) {
        console.log(error);
        res.status(500).send(`${error}`)
      }
    } else {
      res.status(422).send(`Bad url, Please provide an image url`);
    }
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();