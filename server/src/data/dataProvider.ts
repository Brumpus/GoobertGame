import {  get, post, put, remove } from "./manipulate";

type RequestBody = {
	pid: string;
	saveSlot: number;
	data: any;
}
export const getSaveState = async (req: RequestBody) => {
	const saveState = get(getUserSlot(req.pid, req.saveSlot));
	console.log(saveState);
	return saveState;
}
export const createGoobert = async (req: RequestBody) => {
	const goobertId = req.data.id;
	post(getUserSlot(req.pid, req.saveSlot), req.data);

	return getSaveState(req);
}
export const updateGoobert = async (req: RequestBody) => {
	const goobertId = req.data.id;
	const property = req.data.stat;
	const value = req.data.value;
	put(getUserSlot(req.pid, req.saveSlot), goobertId, property, value);

	return getSaveState(req);
}
export const deleteGoobert = async (req: RequestBody) => {
	const goobertId = req.data;
	remove(getUserSlot(req.pid, req.saveSlot), goobertId);

	return getSaveState(req);
}

const getUserSlot = (userId: string, saveSlot: number) => {
	return userId + "_slot" + saveSlot;
}