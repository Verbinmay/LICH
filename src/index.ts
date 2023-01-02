import express, { Request, Response } from "express";
export const app = express();
const port = process.env.PORT || 3000;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

let errorsMessages: Array<Message> = [];
type Message = { message: string; field: string };
function message(a: string, b: string) {
  errorsMessages.push({
    message: a,
    field: b,
  });
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
    errorsMessages = [];

    //тайтл
    let itTitle: string = "";
    if (!req.body.title) {
      message("Write title", "title");
    } else if (typeof req.body.title !== "string") {
      message("Please write string", "title");
    } else if (req.body.title.length > 40) {
      message("Write title less 40 symbols", "title");
    } else {
      itTitle = req.body.title;
    }

    //автор
    let itAuthor: string = "";
    if (!req.body.author) {
      message("Write author", "author");
    } else if (typeof req.body.author !== "string") {
      message("Please write string", "author");
    } else if (req.body.author.length > 20) {
      message("Write author less 20 symbols", "author");
    } else {
      itAuthor = req.body.author;
    }

    //айди
    let itId = 0;
    if (bd.videos.length === 0) {
      itId = 0;
    } else if (bd.videos.length === 1) {
      if (bd.videos[0].id !== 0) {
        itId = 0;
      } else {
        itId = 1;
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
          itId = bd.videos[i].id + 1;
          break;
        }
        if (i === bd.videos.length - 1) {
          itId = bd.videos[i].id + 1;
          break;
        }
      }
    }

    //canBeDownloaded
    let itCanBeDownloaded: boolean = false;
    if (!req.body.canBeDownloaded) {
      itCanBeDownloaded = false;
    } else if (typeof req.body.canBeDownloaded !== "boolean") {
      message("Please write bool", "canBeDownloaded");
    } else if (req.body.canBeDownloaded === true) {
      itCanBeDownloaded = true;
    } else {
      itCanBeDownloaded = false;
    }

    //minAgeRestriction
    let itMinAgeRestriction: number | null = 0;
    if (!req.body.minAgeRestriction) {
      itMinAgeRestriction = null;
    } else if (typeof req.body.minAgeRestriction !== "number") {
      message("Please write number", "minAgeRestriction");
    } else if (
      req.body.minAgeRestriction < 1 ||
      req.body.minAgeRestriction > 18
    ) {
      message("Please write age less than 18 included", "minAgeRestriction");
    } else {
      itMinAgeRestriction = req.body.minAgeRestriction;
    }

    //создание
    let itcreatedAt: string = "";
    if (!req.body.createdAt) {
      itcreatedAt = new Date().toISOString();
    } else if (typeof req.body.createdAt !== "string") {
      message("Please write string", "createdAt");
    } else {
      let a = Date.parse(req.body.createdAt);
      let b = new Date(a);
      let c = b.toISOString();
      itcreatedAt = c;
    }

    //публикация
    let itPublicationDate: string = "";
    if (!req.body.publicationDate) {
      var today = new Date(itcreatedAt);
      let nextDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      itPublicationDate = nextDate.toISOString();
    } else if (typeof req.body.publicationDate !== "string") {
      message("Please write string", "publicationDate");
    } else if (Date.parse(itcreatedAt) > Date.parse(req.body.publicationDate)) {
      var today = new Date(itcreatedAt);
      let nextDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      itPublicationDate = nextDate.toISOString();
    } else {
      let v = Date.parse(req.body.publicationDate);
      let n = new Date(v);
      let l = n.toISOString();
      itPublicationDate = l;
    }

    //разрешения
    let itAvailableResolutions: Array<string> = [];

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
      message(
        'Please write right resolution:[ "P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160" ]',
        "availableResolutions"
      );
    } else if (req.body.availableResolutions.length === 0) {
      message(
        'Please write right resolution:[ "P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160" ]',
        "availableResolutions"
      );
    } else {
      for (let i = 0; i < req.body.availableResolutions.length; i++) {
        if (arrayResolutions.indexOf(req.body.availableResolutions[i]) === -1) {
          message(
            'Please write right resolution:[ "P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160" ]',
            "availableResolutions"
          );
        } else {
          itAvailableResolutions = req.body.availableResolutions;
        }
      }
    }

    //create or not
    if (errorsMessages.length > 0) {
      res.status(400).json({ errorsMessages });
    } else {
      const createVideo: TypeVidios = {
        id: itId,
        title: itTitle,
        author: itAuthor,
        canBeDownloaded: itCanBeDownloaded,
        minAgeRestriction: itMinAgeRestriction,
        createdAt: itcreatedAt,
        publicationDate: itPublicationDate,
        availableResolutions: itAvailableResolutions,
      };
      bd.videos.push(createVideo);
      res.status(201).json(createVideo);
    }
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
    errorsMessages = [];
    let id: number = +req.params.id;

    let search = bd.videos.find((p) => p.id === id);
    if (search == undefined) {
      res.send(404);
    } else {
      let thisVideo: {
        id: number;
        title: string;
        author: string;
        canBeDownloaded: boolean;
        minAgeRestriction: number | null;
        createdAt: string;
        publicationDate: string;
        availableResolutions: Array<string>;
      } = search;

      let dublicatVideo = thisVideo;

      //тайтл
      let itTitle: string = "";
      if (!req.body.title) {
        message("Write title", "title");
      } else if (typeof req.body.title !== "string") {
        message("Please write string", "title");
      } else if (req.body.title.length > 40) {
        message("Write title less 40 symbols", "title");
      } else {
        itTitle = req.body.title;
      }

      //автор
      let itAuthor: string = "";
      if (!req.body.author) {
        message("Write author", "author");
      } else if (typeof req.body.author !== "string") {
        message("Please write string", "author");
      } else if (req.body.author.length > 20) {
        message("Write author less 20 symbols", "author");
      } else {
        itAuthor = req.body.author;
      }

      //canBeDownloaded
      let itCanBeDownloaded: boolean = false;
      if (!req.body.canBeDownloaded) {
        itCanBeDownloaded = false;
      } else if (typeof req.body.canBeDownloaded !== "boolean") {
        message("Please write bool", "canBeDownloaded");
      } else if (req.body.canBeDownloaded === true) {
        itCanBeDownloaded = true;
      } else {
        itCanBeDownloaded = false;
      }

      //minAgeRestriction
      let itMinAgeRestriction: number | null = 0;
      if (!req.body.minAgeRestriction) {
        itMinAgeRestriction = null;
      } else if (typeof req.body.minAgeRestriction !== "number") {
        message("Please write number", "minAgeRestriction");
      } else if (
        req.body.minAgeRestriction < 1 ||
        req.body.minAgeRestriction > 18
      ) {
        message("Please write age less than 18 included", "minAgeRestriction");
      } else {
        itMinAgeRestriction = req.body.minAgeRestriction;
      }

      //публикация
      let itPublicationDate: string = "";
      if (!req.body.publicationDate) {
        var today = new Date();
        itPublicationDate = today.toISOString();
      } else if (typeof req.body.publicationDate !== "string") {
        message("Please write string", "publicationDate");
      } else if (
        Date.parse(thisVideo.createdAt) > Date.parse(req.body.publicationDate)
      ) {
        let newMessageForThis: string =
          "Please write date more than date create : " + thisVideo.createdAt;
        message(newMessageForThis, "publicationDate");
      } else {
        let v = Date.parse(req.body.publicationDate);
        let n = new Date(v);
        let l = n.toISOString();
        itPublicationDate = l;
      }

      //разрешения
      let itAvailableResolutions: Array<string> = [];

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
        message(
          'Please write right resolution:[ "P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160" ]',
          "availableResolutions"
        );
      } else if (req.body.availableResolutions.length === 0) {
        message(
          'Please write right resolution:[ "P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160" ]',
          "availableResolutions"
        );
      } else {
        for (let i = 0; i < req.body.availableResolutions.length; i++) {
          if (
            arrayResolutions.indexOf(req.body.availableResolutions[i]) === -1
          ) {
            message(
              'Please write right resolution:[ "P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160" ]',
              "availableResolutions"
            );
          } else {
            itAvailableResolutions = req.body.availableResolutions;
          }
        }
      }

      //create or not
      if (errorsMessages.length > 0) {
        res.status(400).json({ errorsMessages });
      } else {
        (thisVideo.title = itTitle),
          (thisVideo.author = itAuthor),
          (thisVideo.canBeDownloaded = itCanBeDownloaded),
          (thisVideo.minAgeRestriction = itMinAgeRestriction),
          (thisVideo.publicationDate = itPublicationDate),
          (thisVideo.availableResolutions = itAvailableResolutions),
          res.send(204);
      }
    }
  }
);

/*if (dublicatVideo) {
      if (req.body.title === null) {
        res.status(400).json(message("Write title ", "title"));
        return;
      }
      if (req.body.title) {
        if (req.body.title.length > 40) {
          res.status(400).json(message("Write title less 40 symbols", "title"));
          return;
        }
        dublicatVideo.title = req.body.title;
      }
      //автор
      if (req.body.author === null) {
        res.status(400).json(message("Write author ", "author"));
        return;
      }

      if (req.body.author) {
        if (req.body.author.length > 20) {
          res
            .status(400)
            .json(message("Write author less 20 symbols", "Author"));
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
              message(
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
              message(
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
                  message(
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
      res.status(204).json(thisVideo);
    } else {
      res.send(404);
    }
  }
);
*/
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
