import type { Goobert } from './Goobert';
import useGooberts, { type GoobertAppearance, type GoobertStats } from './GoobertContext';
import * as fs from 'fs';
import * as path from 'path';

type GoobertJson = {
    name: string;
    room: string;

    stats: GoobertStats;

    appearance: GoobertAppearance;

}
export function saveGoobert(goobert: Goobert) {

    saveJsonToFile("savedGooberts/" + goobert.id + ".json", JSON.stringify(goobert));
}
(window as any).saveGoobert = () => saveGoobert;

export function loadGoobert(goobertId: string) {
    let { createGoobert } = useGooberts(); 
    const filePath = path.resolve(__dirname, `savedGooberts/${goobertId}.json`);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const goobert = JSON.parse(rawData) as GoobertJson;


    createGoobert(goobert.name, goobert.room, undefined, undefined, goobert.appearance, goobert.stats);
}
(window as any).loadGoobert = () => saveGoobert;


async function saveJsonToFile(filePath: string, data: any): Promise<void> {
  try {
    // null and 2 formats the JSON with 2-space indentation for readability
    const jsonString = JSON.stringify(data, null, 2); 
    
    await fs.promises.writeFile(filePath, jsonString, 'utf8');
    console.log(`Successfully saved data to ${filePath}`);
  } catch (error) {
    console.error('Error writing JSON to file:', error);
  }
}