import {  DataSource} from "typeorm";
import path from 'path';

import { environment } from './environment';


export const AppDataSource = new DataSource({
        type: 'postgres',
        port: Number(environment.DB_PORT),
        username: environment.DB_USERNAME,
        password: environment.DB_PASSWORD,
        database: environment.DB_DATABASE,
        entities: [
            path.join(__dirname, '../entity/**/**.ts'),
        ],
        synchronize: true,
        logging: true,
    })
    
