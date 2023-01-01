import express, { Request, Response } from "express";
import { brotliDecompress } from "zlib";
const app = express();
const port = process.env.PORT || 3000;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

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

let bd: { videos: TypeVidios[] } = { videos: [] };

app.get("/videos", (req: Request, res: Response) => {
  res.status(200).json(bd.videos);
});

app.post("/videos", (req: Request, res: Response) => {
  //тайтл

  if (!req.body.title) {
    res.status(400).json({
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
    res.status(400).json({
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
    res.status(400).json({
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
    res.status(400).json({
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
  if (bd.videos.length === 0) {
    newId = 0;
  } else if (bd.videos.length === 1) {
    if (bd.videos[0].id !== 0) {
      newId = 0;
    } else {
      newId = 1;
    }
  } else {
    for (let i = 0; i < bd.videos.length; i++) {
      if (bd.videos[i + 1].id - bd.videos[i].id !== 1) {
        newId = bd.videos[i].id + 1;
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
    res.status(400).json({
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
    let a = Date.parse(req.body.createdAt);
    let b = new Date(a);
    let c = b.toISOString();
    createDate = c;
  }

  //публикация
  let publicDate: string;
  let v = Date.parse(req.body.publicationDate);
  if (!req.body.publicationDate || Date.parse(createDate) > v) {
    var today = new Date(createDate);
    let nextDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    publicDate = nextDate.toISOString();
  } else {
    let n = new Date(v);
    let l = n.toISOString();
    publicDate = l;
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
    res.status(400).json({
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
        res.status(400).json({
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

  bd.videos.push(createVideo);
  res.status(201).json(createVideo);
});

app.get("/videos/:id", (req: Request, res: Response) => {
  let id: number = +req.params.id;
  let oneVideo = bd.videos.find((p) => p.id === id);
  if (oneVideo) {
    res.status(200).json(oneVideo);
  } else {
    res.send(404);
  }
});

app.put("/videos/:id", (req: Request, res: Response) => {
  
  let id: number = +req.params.id;
  let oneVideo = bd.videos.find((p) => p.id === id);
  if (oneVideo) {
    res.status(200).json(oneVideo);
  } else {
    res.send(404);
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
