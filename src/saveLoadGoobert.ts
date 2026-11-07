import type { Goobert } from './Goobert';
import useGooberts, { type GoobertAppearance, type GoobertStats } from './GoobertContext';


export type GoobertJson = {
  name: string;
  room: string;

  stats: GoobertStats;

  appearance: GoobertAppearance;

}
export function saveGoobert(goobert: Goobert) {
  saveGoobertToFile("savedGooberts/" + goobert.id + ".json", goobert);
}
(window as any).saveGoobert = saveGoobert;

export async function loadGoobert(goobertId: string) {
  // let { createGoobert } = useGooberts(); 

  // The below code will likely be used after websockets are introduced next week

  // const filePath = (assetPath(`/savedGooberts/${goobertId}.json`));
  // const response = await fetch(filePath);

  // if (!response.ok) {
  //   throw new Error(`HTTP error! Status: ${response.status}`);
  // }

  // const jsonData = await response.json();
  // const goobert: GoobertJson = JSON.parse(jsonData);

  const jsonData = localStorage.getItem(goobertId);
  if(jsonData == undefined) return;
  const goobert: GoobertJson = await JSON.parse(jsonData);
  localStorage.removeItem(goobertId); // Remove from storage

  return goobert;
  // createGoobert(goobert.name, goobert.room, undefined, undefined, goobert.appearance, goobert.stats);
}
(window as any).loadGoobert = loadGoobert;

export async function getState(saveSlot: string): Promise<GoobertJson[] | undefined> {
  // Get JSON from localstorage
  const json = await localStorage.getItem(saveSlot);
  if(!json) return;
  const data = JSON.parse(json) as GoobertJson[];
  
  // Return gooberts
  return data;
}
(window as any).getState = getState;


export async function saveState(gooberts: Goobert[], saveSlot: string) {
  const stats: GoobertStats[] = [...gooberts] as const;
  const appearance: GoobertAppearance[] = [...gooberts] as const;

  // Convert gooberts into JSON format
  const data: GoobertJson[] = gooberts.filter((goobert, i) => stats[i] && appearance[i]).map((goobert, i) => {
    return {...goobert, stats: stats[i], appearance: appearance[i]} as GoobertJson;
  });
  const json = JSON.stringify(data);

  // Save to localStorage
  localStorage.setItem(saveSlot, json);
}
(window as any).saveState = saveState;

async function saveGoobertToFile(filePath: string, goobert: Goobert) {
  const stats: GoobertStats = {...goobert};
  const appearance: GoobertAppearance = {...goobert};

  const data: GoobertJson = {...goobert, stats, appearance};
  const json = JSON.stringify(data);

  localStorage.setItem(goobert.id, json);

  // try {
  //   // null and 2 formats the JSON with 2-space indentation for readability
  //   const jsonString = JSON.stringify(data, null, 2); 
    
  //   await writeFile(filePath, jsonString, 'utf8');
  //   console.log(`Successfully saved data to ${filePath}`);
  // } catch (error) {
  //   console.error('Error writing JSON to file:', error);
  // }
}