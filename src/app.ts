import express, { Application, Request, Response } from "express";
import router from "./app/routes";
import cookieParser from "cookie-parser";
import notFound from "./app/errors/notFound";
import globalErrorHandler from "./app/errors/globalErrorHandler";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.send({
        message: "message server running",
    });
});

app.use("/api/v1", router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
