import mariadb from "mariadb"


const db = mariadb.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "hs_cinema"

})

export default db;