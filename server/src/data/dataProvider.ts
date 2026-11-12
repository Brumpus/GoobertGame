import saveSlot1 from "./SaveSlot1.json";
import saveSlot2 from "./SaveSlot2.json";
import saveSlot3 from "./SaveSlot3.json";

const states = {
	saveSlot1: saveSlot1,
	saveSlot2: saveSlot2,
	saveSlot3: saveSlot3
}
export const getSaveState = async (state: number) => {
	let slot = (states as any)["saveSlot" + state];

	return slot;
}
export const setSaveState = async (state: number) => {
	// let slot = (states as any)["SaveSlot" + state];
	// let data = JSON.parse(slot);

	// return data;
}