import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { TaskCreatorModalComponent } from './modals/task-creator-modal/task-creator-modal.component';

import { HomePageRoutingModule } from './home-routing.module';
import { CategoriesPageModule } from '../categories/categories.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    CategoriesPageModule
  ],
  declarations: [HomePage, TaskCreatorModalComponent]
})
export class HomePageModule {}
