import express, { Request, Response } from "express";
import { brotliDecompress } from "zlib";
const app = express();
const port = process.env.PORT || 3000;
type TypeVidios = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: Array<string | null>;
};

let bd: Array<TypeVidios> = [];

app.get("/", (req: Request, res: Response) => {
  res.send("Hello SAMURAI!");
});

app.post("/", (req: Request, res: Response) => {
  //тайтл

  if (!req.body.title) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "Write title",
          field: "Title",
        },
      ],
    });
    return;
  }
  if (req.body.title.length > 40) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "Write title less 40 symbols",
          field: "Title",
        },
      ],
    });
    return;
  }

  //автор

  if (req.body.author.length > 20) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "Write author less 20 symbols",
          field: "Author",
        },
      ],
    });
    return;
  }
  if (!req.body.author) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "Write author",
          field: "Author",
        },
      ],
    });
    return;
  }

  //айди

  let newId = 0;
  if (bd.length === 0) {
    newId = 0;
  } else if (bd.length === 1) {
    if (bd[0].id !== 0) {
      newId = 0;
    } else {
      newId = 1;
    }
  } else {
    for (let i = 0; i < bd.length; i++) {
      if (bd[i + 1].id - bd[i].id !== 1) {
        newId = bd[i].id + 1;
      }
    }
  }

  //canBeDownloaded

  let canDownloaded: boolean;
  if (!req.body.canBeDownloaded) {
    canDownloaded = false;
  } else {
    canDownloaded = req.body.canBeDownloaded;
  }

  //minAgeRestriction
  let ageReg: number | null;
  if (!req.body.minAgeRestriction) {
    ageReg = null;
  } else if (
    req.body.minAgeRestriction < 1 &&
    req.body.minAgeRestriction > 18
  ) {
    res.status(400).send({
      errorsMessages: [
        {
          message: "Please write age less than 18 included",
          field: "minAgeRestriction",
        },
      ],
    });
    return;
  } else {
    ageReg = req.body.minAgeRestriction;
  }
  //создание
  let createDate: string;
  if (!req.body.createdAt) {
    createDate = new Date().toISOString();
  } else {
    createDate = req.body.createdAt.toISOString();
  }

  //публикация
  let publicDate: string;
  if (!req.body.publicationDate) {
    var today = new Date();
    let nextDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    publicDate = nextDate.toISOString();
  } else {
    publicDate = req.body.createdAt.toISOString();
  }

  //разрешения

  let razreshenie: Array<string> = [];

  const arrayResolutions = [
    "P144",
    "P240",
    "P360",
    "P480",
    "P720",
    "P1080",
    "P1440",
    "P2160",
  ];

  if (!req.body.availableResolutions) {
    res.status(400).send({
      errorsMessages: [
        {
          message:
            "Please write right resolution:[ P144, P240, P360, P480, P720, P1080, P1440, P2160 ]",
          field: "availableResolutions",
        },
      ],
    });
    return;
  } else {
    for (let i = 0; i < req.body.availableResolutions.length; i++) {
      if (arrayResolutions.indexOf(req.body.availableResolutions[i]) === -1) {
        res.status(400).send({
          errorsMessages: [
            {
              message:
                "Please write right resolution:[ P144, P240, P360, P480, P720, P1080, P1440, P2160 ]",
              field: "availableResolutions",
            },
          ],
        });
        return;
      } else {
        razreshenie = req.body.availableResolutions;
      }
    }
  }

  const createVideo: TypeVidios = {
    id: newId,
    title: req.body.title,
    author: req.body.author,
    canBeDownloaded: canDownloaded,
    minAgeRestriction: ageReg,
    createdAt: createDate,
    publicationDate: publicDate,
    availableResolutions: razreshenie,
  };
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
