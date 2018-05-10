import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AuthStateService } from './auth-state.service';
import { LoginComponent } from './login/login.component';
import { AccountCreationComponent } from './account-creation/account-creation.component';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [LoginComponent, AccountCreationComponent],
	imports: [
		HttpClientModule,
		FormsModule
	],
	exports: [
		LoginComponent,
		AccountCreationComponent
	],
	providers: [AuthStateService]
})
export class AuthenticationModule { }
