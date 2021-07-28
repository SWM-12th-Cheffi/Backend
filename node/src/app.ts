import www from "./www";
import {createServer} from "http";

const port: number = Number(process.env.PORT) || 2001;

const server = createServer(www);

server.listen(port, () => {
    console.log(`${port}포트 서버 대기 중!`);
});

export default server;