import Database from "better-sqlite3";
import { GoobertData } from "./initialize";

const db = new Database("./dist/gooberts.db");

// POST
const goobertInsert = db.prepare(`
    INSERT OR IGNORE INTO gooberts (
        user_slot, id, name, room,

        is_mutant, mutant_type, 
        fullness, entertainment, awakeness, cleanliness,

        appearance
    ) VALUES (
        ?, ?, ?, ?, 
        
        ?, ?, 
        ?, ?, ?, ?, 

        ?
    )
`);
export const post = (user_slot: string, goobert: GoobertData) => {
    goobert.name, goobert.room,
    goobertInsert.run(
        user_slot, goobert.id, goobert.name, goobert.room, 

        goobert.isMutant ? 1 : 0, goobert.mutantType,
        goobert.fullness, goobert.entertainment, goobert.awakeness, goobert.cleanliness,

        goobert.appearance
    );
}
// GET
const selectAll = db.prepare(`
    SELECT 
        uid, user_slot, id, name, room,

        is_mutant, mutant_type, 
        fullness, entertainment, awakeness, cleanliness,

        appearance
    FROM gooberts
    WHERE user_slot = ?
`);
export const get = (user_slot: string) => {
    let data = selectAll.all(user_slot);
    return data;
}

// PUT
export const put = (user_slot: string, id: string, property: string, value: number | string) => {
    const updateOne = db.prepare(`
        UPDATE gooberts
        SET ${property} = ?
        WHERE user_slot = ? AND id = ?
    `);
    
    return updateOne.run(value, user_slot, id);
};

// DELETE
const deleteOne = db.prepare(`
    DELETE FROM gooberts WHERE user_slot = ? AND id = ?
`);
export const remove = (user_slot: string, id: string) => {
    deleteOne.run(user_slot, id);
}