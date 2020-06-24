import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { getUniqueId } from './util';

@Injectable({
	providedIn: 'root',
})
export class StorageService {
	private state = {};

	constructor() {
		this.restoreKeyState();
	}

	public get<T>(key: string): Observable<T> {
		const id = this.getIdForKey(key);
		const value = localStorage.getItem(id);

		if (value) {
			const data = JSON.parse(atob(value)) as T;
			return of(data);
		}

		return of(null);
	}

	public set<T>(key: string, data: T): void {
		const id = this.getIdForKey(key);
		const value = btoa(JSON.stringify(data));
		localStorage.setItem(id, value);
	}

	public remove(key: string) {
		const id = this.getIdForKey(key);
		localStorage.removeItem(id);
		delete this.state[key];
	}

	private getIdForKey(key: string): string {
		if (!this.state[key]) {
			this.state[key] = getUniqueId();
		}

		this.saveKeyState();

		return this.state[key];
	}

	private saveKeyState(): void {
		const state = btoa(JSON.stringify(this.state));
		localStorage.setItem('intst', state);
	}

	private restoreKeyState(): void {
		const serialized = localStorage.getItem('intst');

		if (serialized) {
			this.state = JSON.parse(atob(serialized));
		}
	}
}
