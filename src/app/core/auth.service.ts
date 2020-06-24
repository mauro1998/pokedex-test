import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AuthUser, User } from './models';
import { StorageService } from './storage.service';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private collectionKey = 'users';
	private sessionKey = 'session';

	constructor(private storage: StorageService) {}

	private setSession(user: User): void {
		this.storage.set(this.sessionKey, user);
	}

	public getSession(): Observable<User> {
		return this.storage.get<User>(this.sessionKey).pipe(
			map((user) => {
				return user
					? new User(
							user.firstName,
							user.lastName,
							user.email,
							user.id
					  )
					: null;
			})
		);
	}

	public logOut(): void {
		this.storage.remove(this.sessionKey);
	}

	public signInWithEmailAndPassword(
		email: string,
		password: string
	): Observable<User> {
		const users$ = this.getUsers();
		return users$.pipe(
			delay(Math.floor(Math.random() * 1000) + 300),
			map((users) => {
				const authUser = users.find(
					(user) => user.email === email && user.password === password
				);

				if (!authUser) {
					throw new Error('Invalid username or password');
				}

				this.setSession(authUser.user);

				return authUser.user;
			})
		);
	}

	public signUpWithEmailAndPassword(
		firstName: string,
		lastName: string,
		email: string,
		password: string
	): Observable<User> {
		return this.getUsers().pipe(
			delay(Math.floor(Math.random() * 1000) + 300),
			map((users) => {
				const newUser = new AuthUser(
					email,
					password,
					firstName,
					lastName
				);

				const exists = users.find(
					(user) => user.email === newUser.email
				);

				if (exists) {
					throw new Error('User already exists');
				}

				users.push(newUser);

				try {
					this.storage.set(this.collectionKey, users);
					this.setSession(newUser.user);
				} catch (e) {
					console.error(e);
					throw new Error(
						'Error creating the new user, please try again'
					);
				}

				return newUser.user;
			})
		);
	}

	private getUsers(): Observable<AuthUser[]> {
		return this.storage
			.get<AuthUser[]>(this.collectionKey)
			.pipe(map((users) => (Array.isArray(users) ? users : [])));
	}
}
