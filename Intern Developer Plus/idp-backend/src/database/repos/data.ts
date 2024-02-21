import {IDatabase, IMain} from "pg-promise";
import {data as sql} from "../sql"
import {IData} from "../models";

export class DataRepository {

    cs
    add_multiple_query

    // Custom type formatting
    limit_formatter
    timestamp_formatter

    constructor(private db: IDatabase<any>, private pgp: IMain) {

        // If your repository needs to use helpers like ColumnSet,
        // you should create it conditionally, inside the constructor,
        // i.e. only once, as a singleton.

        this.cs = new pgp.helpers.ColumnSet(["val"], {table: "data"})
        this.add_multiple_query = (values: { val: string }[]) => pgp.helpers.insert(values, this.cs) + "RETURNING *"

        // rawType is vulnerable to SQL injection
        // Must make sure val is a number
        // http://localhost:8080/data?limit=5;%20TRUNCATE%20TABLE%20data worked before sanitizing
        // Using the formatter in raw mode is recommended by the creator of the library himself:
        // https://stackoverflow.com/a/60769586
        this.limit_formatter = (val: number) => ({rawType: true, toPostgres: () => val >= 0 ? `LIMIT ${val}` : ''})

        this.timestamp_formatter = (val: Date) => ({rawType: true, toPostgres: () => !isNaN(val.getTime()) ? `WHERE batch_timestamp > ${this.pgp.as.date(val)}` : ''})
    }


    create(): Promise<null> {
        return this.db.none(sql.create)
    }

    // Adds a new record and returns the full object;
    add(val: string): Promise<IData> {
        return this.db.one(sql.add, {val: val})
    }

    add_multiple(values: { val: string }[]): Promise<IData[]> {
        return this.db.many(this.add_multiple_query(values))
    }

    get_all(limit: number, from: Date): Promise<IData[]> {
        console.debug(`from is: ${from}`)
        console.debug(`pg promise from is: ${this.pgp.as.date(from)}`)

        return this.db.any(sql.get_all, {
            limit: this.limit_formatter(limit),
            from: this.timestamp_formatter(from)
        })
    }

    // Removes all records from the table
    empty(): Promise<null> {
        return this.db.none(sql.empty);
    }
}