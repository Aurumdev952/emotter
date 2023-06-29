/* eslint-disable @typescript-eslint/ban-types */
import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";
import { env } from "~/env.mjs";
import { getServerAuthSession } from "~/server/auth";

import Cors from 'cors'


// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options

// export const config = {
//   runtime: 'edge',
// }
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

type Upload = {
  file: string;
} | null | undefined;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const session = await getServerAuthSession({
  //   req: req,
  //   res: res
  // })
  // if (!session) {
  //   res.status(403).json({
  //     error: "unauthorized"
  //   })
  // }
  const cors = Cors({
    methods: ['POST', 'DELETE']
  })
  await runMiddleware(req, res, cors)
  const { method } = req
  switch (method) {
    case "POST":
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const image = req.body as Upload;
        if (image) {
          cloudinary.config({
            cloud_name: env.CLOUDINARY_CLOUD_NAME,
            api_key: env.CLOUDINARY_API_KEY,
            api_secret: env.CLOUDINARY_API_SECRET,
          });
          const result = await cloudinary.uploader.upload(image.file, {
            upload_preset: "emotter_preset"
          });
          res.status(200).json(result);
        } else {
          res.status(404).json({
            error: "Bad request",
          });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({
          error: error
        })
      }
      break;
    case "DELETE":
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const image = req.body as Upload
        if (image) {
          cloudinary.config({
            cloud_name: env.CLOUDINARY_CLOUD_NAME,
            api_key: env.CLOUDINARY_API_KEY,
            api_secret: env.CLOUDINARY_API_SECRET,
          });

          cloudinary.uploader.destroy(image.file)
            .then((data) => {
            res.status(200).json(data);
          }).catch((err) => {
            res.status(500).json(err);
          })
        } else {
          res.status(404).json({
            error: "Bad request",
          });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({
          error: error
        })
      }
      break;
    default:
      res.status(403).json({
        error: "Http method not supported"
      })
      break;
  }
}


