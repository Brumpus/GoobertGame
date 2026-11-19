import axios from 'axios';
import type { Goobert, GoobertProps } from './Goobert';
import { body } from './games/games-global';

type RequestBody = {
	pid: string;
	saveSlot: number;
	data: any;
}
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

let pid = localStorage.getItem("pid");
const filePath = "http://localhost:3000";

export async function getState(pid: string, saveSlot: number): Promise<GoobertProps[] | undefined> {
  try {
    const params = new URLSearchParams({
      pid: pid,
      slot: saveSlot.toString()
    });
    const response = await axios.get(`${filePath}/gooberts?${params.toString()}`, {
    headers: {
      Accept: "application/json"
      }
    });

    // Get JSON from localstorage
    // const json = await localStorage.getItem("saveSlot" + saveSlot);
    
    // Get JSON from Server
    const data = await response.data as GoobertData[];
    // const data = JSON.parse(json) as GoobertData[];
    const gooberts: GoobertProps[] = data.map((goobert) => {
      const appearanceArray = goobert.appearance.split("_");
      const appearanceProps = {
        bodyType: parseInt(appearanceArray[0]!),
        bodyColor: parseInt(appearanceArray[1]!),
        legType: parseInt(appearanceArray[2]!),
        legColor: parseInt(appearanceArray[3]!),
        eyeType: parseInt(appearanceArray[4]!),
        eyeExpression: parseInt(appearanceArray[5]!),
        mouthType: parseInt(appearanceArray[6]!),
        mouthExpression: parseInt(appearanceArray[7]!)
      };
      delete (goobert as any).appearance;

      return {
        ...goobert,
        isUi: false,
        fromServer: true,

        ...appearanceProps
      }
    })

    // Return gooberts
    return gooberts;
  } catch(error) {
    // Server not running
    console.log("failed to connect.");
    console.log(error);

    const json = await localStorage.getItem("slot" + saveSlot);
    if(!json) return;
    const data = JSON.parse(json) as GoobertProps[];

    return data;
  }
}
(window as any).getState = getState;


export async function saveState(pid: string, gooberts: Goobert[], saveSlot: string) {
  const json = JSON.stringify(gooberts);

  // Save to localStorage
  localStorage.setItem(saveSlot, json);
}
(window as any).saveState = saveState;

export async function saveGoobertToDatabase(pid: string, saveSlot: number, goobert: Goobert) {
    const data: GoobertData = getGoobertData(goobert);
    const request: RequestBody = {
      pid: pid,
      saveSlot: saveSlot,
      data: data
    }
    const json = JSON.stringify(request);
  try {    
    const response = await axios.post(`${filePath}/gooberts`, {
    headers: {
      Accept: "application/json"
      },
      body: json
    });

  } catch(error) {
    // Server not running
    console.log("failed to connect.");
    console.log(error);

    const json = await localStorage.getItem("slot" + saveSlot);
    if(!json) return;
    const data = JSON.parse(json) as GoobertProps[];

    return data;
  }
}
export async function updateGoobert(pid: string, saveSlot: number, goobertId: string, stat: string, value: number | string) {
    const data = {
      goobertId: goobertId,
      stat: stat,
      value: value
    }
    const request: RequestBody = {
      pid: pid,
      saveSlot: saveSlot,
      data: data
    }
    const json = JSON.stringify(request);
  try {    
    const response = await axios.put(`${filePath}/gooberts`, {
    headers: {
      Accept: "application/json"
      },
      body: json
    });

  } catch(error) {
    // Server not running
    console.log("failed to connect.");
    console.log(error);

    const json = await localStorage.getItem("slot" + saveSlot);
    if(!json) return;
    const data = JSON.parse(json) as GoobertProps[];

    return data;
  }
}
export async function deleteGoobert(pid: string, saveSlot: number, goobertId: number) {
    const data = goobertId;
    const request: RequestBody = {
      pid: pid,
      saveSlot: saveSlot,
      data: data
    }
    const json = JSON.stringify(request);
  try {    
    const response = await axios.delete(`${filePath}/gooberts`, {
    headers: {
      Accept: "application/json"
    },
      // body: json
    });

  } catch(error) {
    // Server not running
    console.log("failed to connect.");
    console.log(error);

    const json = await localStorage.getItem("slot" + saveSlot);
    if(!json) return;
    const data = JSON.parse(json) as GoobertProps[];

    return data;
  }
}


const getGoobertData = (goobert: Goobert) => {
const appearance = `
    ${goobert.bodyType}_
    ${goobert.bodyColor}_
    ${goobert.legType}_
    ${goobert.legColor}_
    ${goobert.eyeType}_
    ${goobert.eyeExpression}_
    ${goobert.mouthType}_
    ${goobert.mouthExpression}
  `.replace(/\s+/g, '');
  return {
      name: goobert.name,
      room: goobert.room,
      id: goobert.id,

      isMutant: goobert.isMutant, 
      mutantType: goobert.mutantType ?? -1, 

      fullness: goobert.fullness, 
      entertainment: goobert.entertainment,
      awakeness: goobert.awakeness, 
      cleanliness: goobert.cleanliness,

      appearance: appearance
    };
}