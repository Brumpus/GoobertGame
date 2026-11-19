import Database from "better-sqlite3";

const db = new Database("./dist/gooberts.db");


export type GoobertData = {
    name: string;
    room: string;
    id: string;

    isMutant: boolean;
    mutantType: number;

    fullness: number;
    entertainment: number;
    awakeness: number;
    cleanliness: number;

    appearance: string;
};


const createUserTable = `CREATE TABLE IF NOT EXISTS users (
    uid INTEGER PRIMARY KEY AUTOINCREMENT,
    pid TEXT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
)`;
db.exec(createUserTable);

const createGoobertTable = `CREATE TABLE IF NOT EXISTS gooberts (
    uid INTEGER PRIMARY KEY AUTOINCREMENT,
    user_slot TEXT,
    id TEXT NOT NULL,
    name TEXT NOT NULL,
    room TEXT NOT NULL,

    is_mutant INTEGER,
    mutant_type INTEGER,

    fullness INTEGER,
    entertainment INTEGER,
    awakeness INTEGER,
    cleanliness INTEGER,

    appearance TEXT
)`;
db.exec(createGoobertTable);



db.close();