import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';

@NgModule({
  declarations: [
    EmptyStateComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    EmptyStateComponent
  ]
})
export class SharedModule { }
