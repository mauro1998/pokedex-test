import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(private _auth: AuthService, private _router: Router) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> {
		return this._auth.getSession().pipe(
			map((user) => {
				switch (state.url) {
					case '/sign-in':
					case '/sign-up':
						return user
							? this._router.createUrlTree(['dashboard'])
							: true;
					default:
						return user
							? true
							: this._router.createUrlTree(['sign-in']);
				}
			})
		);
	}
}
