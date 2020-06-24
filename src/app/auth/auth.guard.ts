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
	constructor(private auth: AuthService, private router: Router) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> {
		return this.auth.getSession().pipe(
			map((user) => {
				switch (state.url) {
					case '/sign-in':
					case '/sign-up':
						return user
							? this.router.createUrlTree(['dashboard'])
							: true;
					case '/dashboard':
						return user
							? true
							: this.router.createUrlTree(['sign-in']);
					default:
						return true;
				}
			})
		);
	}
}
