import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ServerComponentComponent } from './server-component/server-component.component';
import { DataBindingComponent } from './data-binding/data-binding.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { PasswordTestComponent } from './password-test/password-test.component';
import { ObservablesComponent } from './observables/observables.component';

@NgModule({
  declarations: [
    AppComponent,
    ServerComponentComponent,
    DataBindingComponent,
    ContactFormComponent,
    PasswordTestComponent,
    ObservablesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
