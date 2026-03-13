import { Routes } from '@angular/router';
import { Pricing } from './components/pricing/pricing';
import { Landing } from './common/landing/landing';
import { Dashboard } from './common/dashboard/dashboard';

export const routes: Routes = [
    {path:'' , component:Landing},
    {path:'landing' , component:Landing},
    {path:'pricing' , component:Pricing},
    {path: 'dashboard' , component : Dashboard},
    {path:'**' , redirectTo:'landing' , pathMatch:'full'}
];
