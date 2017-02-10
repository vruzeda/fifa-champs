import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterializeModule } from 'angular2-materialize';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CreatePlayerComponent } from './create-player/create-player.component';
import { StandingTableComponent } from './standing-table/standing-table.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InsertMatchComponent } from './insert-match/insert-match.component';
import { DropdownPlayerComponent } from './dropdown-player/dropdown-player.component';
import { SeasonSelectorComponent } from './season-selector/season-selector.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { PlayersListComponent } from './players-list/players-list.component';
import { SeasonComponent } from './season/season.component';

import { LoginService } from './login.service';
import { PlayerService } from './player.service';
import { MatchService } from './match.service';
import { ApiRequestService } from './api-request.service';

import { RouterModule, Routes } from '@angular/router';
import { appRoutes } from './routes';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		CreatePlayerComponent,
	    InsertMatchComponent,
		StandingTableComponent,
		PageNotFoundComponent,
		SeasonComponent,
		SeasonSelectorComponent,
		NavigationBarComponent,
		PlayersListComponent
		DropdownPlayerComponent,
		NavigationBarComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		MaterializeModule,
		RouterModule.forRoot(appRoutes)
	],
	providers: [LoginService, PlayerService, MatchService, ApiRequestService],
	bootstrap: [AppComponent]
})
export class AppModule { }
