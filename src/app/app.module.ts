import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideRemoteConfig, getRemoteConfig } from '@angular/fire/remote-config';
import { TaskRepository } from './repositories/task.repository';
import { CategoryRepository } from './repositories/category.repository';
import { ConfigurationRepository } from './repositories/configuration.repository';
import { Database } from './services/database';
import { RemoteConfig } from './services/remote-config';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    SQLite,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: TaskRepository, useClass: Database },
    { provide: CategoryRepository, useClass: Database },
    { provide: ConfigurationRepository, useClass: RemoteConfig },
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideRemoteConfig(() => getRemoteConfig())
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
