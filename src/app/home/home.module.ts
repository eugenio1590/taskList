import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { TaskCreatorModalComponent } from './modals/task-creator-modal/task-creator-modal.component';
import { CategoriesFilterModalComponent } from './modals/categories-filter-modal/categories-filter-modal.component';

import { SharedModule } from '../shared/shared.module';
import { HomePageRoutingModule } from './home-routing.module';
import { CategoriesPageModule } from '../categories/categories.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    HomePageRoutingModule,
    CategoriesPageModule
  ],
  declarations: [HomePage, TaskCreatorModalComponent, CategoriesFilterModalComponent]
})
export class HomePageModule {}
