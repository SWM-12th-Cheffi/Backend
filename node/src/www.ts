import * as express from "express";
import { addAbortSignal } from "stream";

//import AddIG from "./func/AddIG"

const app: express.Application = express();

// Connecting Test
app.post(
  "/",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.send("Connection Successful" + req.body.title);
      
  }
);

// 냉장고에 재료를 추가하는 기능
app.get(
  "/AddIG",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.send({name: "ingAdd Pages"});
  }
);

// 재료를 통해 만들 수 있는 레시피 개수를 반환하는 기능
app.get(
  "/NumPossiRP",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.send({name: "ingSearch Pages"});
  }
);

// 재료를 통해 만들 수 있는 레시피 목록을 반환하는 기능
app.get(
  "/ListPossiRP",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.send({name: "ingSearch Pages"});
  }
);

// 특정 레시피의 정보를 반환하는 기능
app.get(
  "/ShowRPInspect",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.send({name: "ingSearch Pages"});
  }
);

// 해당 요리를 끝마쳤다는 정보를 받은 뒤 추천 반영
app.get(
  "/FineCook",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.send({name: "ingSearch Pages"});
  }
);

// 재료를 검색할 때 동적으로 반응하여 보여주는 기능
app.get(
  "/ShowIGDynamic",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.send({name: "ingSearch Pages"});
  }
);

// 레시피 목록을 선호도를 기반으로 정렬하는 기능
app.get(
  "/OrderByFavorite",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.send({name: "ingSearch Pages"});
  }
);

export default app;