import { startServer } from './server';
import {AppDataSource,} from './config/typeorm'


async function main(){

    //database on postgres
    await AppDataSource.initialize();
    console.log("Database Connected")
    const port: number =4000;
    //server graph ql
    const app = await startServer();
    //Localhost
    app.listen(port);
    console.log("App running on port", port);
}

main();