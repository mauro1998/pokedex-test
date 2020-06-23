import { getUniqueId, saveTrim, isValidEmail } from '../util';

export class User {
	public id: string;

	constructor(
		public firstName: string,
		public lastName: string,
		public email: string,
		id: string = getUniqueId()
	) {
		this.id = id;
	}

	public get fullName(): string {
		return `${this.firstName} ${this.lastName}`;
	}
}

export class AuthUser {
	public user: User;
	public email: string;

	constructor(
		_email: string,
		public password: string,
		_firstName: string,
		_lastName: string
	) {
		const email = saveTrim(_email);
		const firstName = saveTrim(_firstName);
		const lastName = saveTrim(_lastName);

		if (!email || !isValidEmail(email)) {
			throw new Error('Invalid email format');
		}

		this.email = email;
		this.user = new User(firstName, lastName, email);
	}
}
