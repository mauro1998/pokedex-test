import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { PokeapiService } from './pokeapi.service';
import { StorageService } from './storage.service';

@NgModule({
	imports: [CommonModule, HttpClientModule],
	providers: [StorageService, AuthService, PokeapiService],
})
export class CoreModule {}
