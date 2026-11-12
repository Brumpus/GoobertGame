import type { Goobert } from './Goobert';

export function saveGoobert(goobert: Goobert) {
  saveGoobertToFile("savedGooberts/" + goobert.id + ".json", goobert);
}
(window as any).saveGoobert = saveGoobert;

export async function loadGoobert(goobertId: string) {
  const filePath = ("http://localhost:3000/gooberts");
  const response = await fetch(filePath);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const jsonData = await response.json();
  const goobert: Goobert = JSON.parse(jsonData);

  // const jsonData = localStorage.getItem(goobertId);
  // if(jsonData == undefined) return;
  // const goobert: Goobert = await JSON.parse(jsonData);
  // localStorage.removeItem(goobertId); // Remove from storage

  return goobert;
  // createGoobert(goobert.name, goobert.room, undefined, undefined, goobert.appearance, goobert.stats);
}
(window as any).loadGoobert = loadGoobert;

export async function getState(saveSlot: number): Promise<Goobert[] | undefined> {
  console.log("Getting data...");
  const filePath = "http://localhost:3000";
  const response = await fetch(`${filePath}/gooberts?slot=${saveSlot}`);

  console.log("Response obtained! Response: " + response);

  if (!response.ok) {
    console.log("Failed to fetch. Aborting...");
    return [];
    // throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // Get JSON from localstorage
  // const json = await localStorage.getItem("saveSlot" + saveSlot);
  // Get JSON from Server
  const json = await response.json();
  console.log("JSON " + json);
  if(!json) return;
  const data = JSON.parse(json) as Goobert[];

  // Return gooberts
  return data;
}
(window as any).getState = getState;


export async function saveState(gooberts: Goobert[], saveSlot: string) {
  const json = JSON.stringify(gooberts);

  // Save to localStorage
  localStorage.setItem(saveSlot, json);
}
(window as any).saveState = saveState;

async function saveGoobertToFile(filePath: string, goobert: Goobert) {
  const data: Goobert = {...goobert};
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