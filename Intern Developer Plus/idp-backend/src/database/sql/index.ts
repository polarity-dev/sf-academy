import {IQueryFileOptions, QueryFile} from "pg-promise";
import {join} from "path"

const tag: string = "SQL"

export const data = {
    create: sql("data/create.sql"),
    add: sql("data/add.sql"),
    get_all: sql("data/get_all.sql"),
    empty: sql("data/empty.sql")
}

// Represents an external SQL file
function sql(file: string): QueryFile {

    // Generating full path
    // __dirname is an environment variable containing the absolute path of the executing file
    const fullPath: string = join(__dirname, file)

    const options: IQueryFileOptions = {

        // minifying the SQL is always advised
        minify: true
    }

    const qf: QueryFile = new QueryFile(fullPath, options)

    if (qf.error) {
        console.error(`[${tag}]: An error has occurred while generating the query file: ${qf.error}`)
    }

    return qf;

}