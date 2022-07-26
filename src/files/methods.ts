

export function moreMinusNum(num: number) {
	return num < 0 ? 0: num;
}

export function copyObject(object: Object) {
	return JSON.parse(JSON.stringify(object));
}