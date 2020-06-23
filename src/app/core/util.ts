export function getUniqueId(): string {
	return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function saveTrim(str: string) {
	return (str || '').trim();
}

export function isValidEmail(email: string) {
	const value = saveTrim(email);
	const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regex.test(value);
}
