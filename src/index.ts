import express, { Request, Response } from "express";
export const app = express();
const port = process.env.PORT || 3000;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

function errorMessage(a: string, b: string) {
  return {
    errorsMessages: [
      {
        message: a,
        field: b,
      },
    ],
  };
}

export type TypeVidios = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: Array<string>;
};

let bd: { videos: TypeVidios[] } = { videos: [] };

app.get("/videos", (req: Request, res: Response) => {
  res.status(200).json(bd.videos);
});

app.post(
  "/videos",
  (
    req: Request<
      {},
      {},
      {
        id: number;
        title: string;
        author: string;
        canBeDownloaded: boolean;
        minAgeRestriction: number | null;
        createdAt: string;
        publicationDate: string;
        availableResolutions: Array<string>;
      }
    >,
    res: Response
  ) => {
    //тайтл

    if (!req.body.title) {
      res.status(400).json(errorMessage("Write title", "title"));
      return;
    }
    if (req.body.title.length > 40) {
      res
        .status(400)
        .json(errorMessage("Write title less 40 symbols", "title"));
      return;
    }

    //автор

    if (req.body.author.length > 20) {
      res
        .status(400)
        .json(errorMessage("Write author less 20 symbols", "author"));
      return;
    }
    if (!req.body.author) {
      res.status(400).json(errorMessage("Write author", "Author"));
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
      for (let i = 1; i < bd.videos.length; i++) {
        let indexTwo = i - 1;
        let elementTwo = bd.videos[indexTwo];
        let idTwo = elementTwo.id;
        let elementOne = bd.videos[i];
        let idOne = elementOne.id;
        let raznitsaId = idOne - idTwo;
        if (raznitsaId !== 1) {
          newId = bd.videos[i].id + 1;
          break;
        }
        if (i === bd.videos.length - 1) {
          newId = bd.videos[i].id + 1;
          break;
        }
      }
    }

    //canBeDownloaded

    let canDownloaded: boolean;
    if (req.body.canBeDownloaded === true) {
      canDownloaded = true;
    } else {
      canDownloaded = false;
    }

    //minAgeRestriction

    let ageReg;
    if (!req.body.minAgeRestriction) {
      ageReg = null;
    } else if (
      req.body.minAgeRestriction < 1 ||
      req.body.minAgeRestriction > 18
    ) {
      res
        .status(400)
        .json(
          errorMessage(
            "Please write age less than 18 included",
            "minAgeRestriction"
          )
        );
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
      res
        .status(400)
        .json(
          errorMessage(
            'Please write right resolution:[ "P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160" ]',
            "availableResolutions"
          )
        );
      return;
    } else if (req.body.availableResolutions.length === 0) {
      res
        .status(400)
        .json(
          errorMessage(
            'Please write right resolution:[ "P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160" ]',
            "availableResolutions"
          )
        );
      return;
    } else {
      for (let i = 0; i < req.body.availableResolutions.length; i++) {
        if (arrayResolutions.indexOf(req.body.availableResolutions[i]) === -1) {
          res
            .status(400)
            .json(
              errorMessage(
                'Please write right resolution:[ "P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160" ]',
                "availableResolutions"
              )
            );
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
  }
);

app.get("/videos/:id", (req: Request, res: Response) => {
  let id: number = +req.params.id;
  let oneVideo = bd.videos.find((p) => p.id === id);
  if (oneVideo) {
    res.status(200).json(oneVideo);
  } else {
    res.send(404);
  }
});

app.put(
  "/videos/:id",
  (
    req: Request<
      { id: string },
      {},
      {
        id: number;
        title: string;
        author: string;
        canBeDownloaded: boolean;
        minAgeRestriction: number | null;
        createdAt: string;
        publicationDate: string;
        availableResolutions: Array<string>;
      }
    >,
    res: Response
  ) => {
    let id: number = +req.params.id;
    let thisVideo = bd.videos.find((p) => p.id === id);

    let dublicatVideo = thisVideo;
    if (dublicatVideo) {
      if (req.body.title) {
        if (req.body.title.length > 40) {
          res
            .status(400)
            .json(errorMessage("Write title less 40 symbols", "title"));
          return;
        }
        dublicatVideo.title = req.body.title;
      }
      //автор
      if (req.body.author) {
        if (req.body.author.length > 20) {
          res
            .status(400)
            .json(errorMessage("Write author less 20 symbols", "Author"));
          return;
        }
        dublicatVideo.author = req.body.author;
      }
      //canDownloaded
      if (req.body.canBeDownloaded === true || false) {
        dublicatVideo.canBeDownloaded = req.body.canBeDownloaded;
      }

      //minAgeRestriction
      if (req.body.minAgeRestriction !== null) {
        let ageReg: number;
        if (req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 1) {
          res
            .status(400)
            .json(
              errorMessage(
                "Please write age less than 18 included",
                "minAgeRestriction"
              )
            );
          return;
        } else {
          ageReg = req.body.minAgeRestriction;
          dublicatVideo.minAgeRestriction = ageReg;
        }
      } else {
        dublicatVideo.minAgeRestriction = null;
      }

      //публикация

      let publicDate: string;
      publicDate = new Date().toISOString();
      dublicatVideo.publicationDate = publicDate;

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

      if (req.body.availableResolutions) {
        if (req.body.availableResolutions.length === 0) {
          res
            .status(400)
            .json(
              errorMessage(
                'Please write right resolution:[ "P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160" ]',
                "availableResolutions"
              )
            );
          return;
        } else {
          for (let i = 0; i < req.body.availableResolutions.length; i++) {
            if (
              arrayResolutions.indexOf(req.body.availableResolutions[i]) === -1
            ) {
              res
                .status(400)
                .json(
                  errorMessage(
                    'Please write right resolution:[ "P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160" ]',
                    "availableResolutions"
                  )
                );
              return;
            } else {
              razreshenie = req.body.availableResolutions;
              dublicatVideo.availableResolutions = razreshenie;
            }
          }
        }
      }
      thisVideo = dublicatVideo;
      res.status(200).json(thisVideo);
    } else {
      res.send(404);
    }
  }
);

app.delete("/videos/:id", (req: Request, res: Response) => {
  let id: number = +req.params.id;
  let oneVideo = bd.videos.find((p) => p.id === id);
  if (oneVideo === undefined) {
    res.send(404);
  } else {
    bd.videos = bd.videos.filter((p) => p.id !== id);
    res.send(204);
  }
});

app.delete("/testing/all-data", (req: Request, res: Response) => {
  bd.videos = [];
  res.send(204);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
