import pgPromise, {IDatabase} from "pg-promise";
import * as dbConfig from "../db-config.json";
import {DataRepository, IExtensions} from "./repos";
import {IInitOptions, IMain} from "pg-promise";

type ExtendedProtocol = IDatabase<IExtensions> & IExtensions

// pg-promise initialization options
const initOptions:IInitOptions<IExtensions> = {

    // We extend Database with our custom classes
    extend(obj: ExtendedProtocol) {

        obj.data = new DataRepository(obj, pgp)
    },
    capSQL: true
}

const pgp: IMain = pgPromise(initOptions)

// https://github.com/vitaly-t/pg-promise/wiki/Connection-Syntax
const db: ExtendedProtocol = pgp(dbConfig)

export {db, pgp}