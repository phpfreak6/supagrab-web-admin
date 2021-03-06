import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MainComponent} from '@modules/main/main.component';
import {BlankComponent} from '@pages/blank/blank.component';
import {LoginComponent} from '@modules/login/login.component';
import {ProfileComponent} from '@pages/profile/profile.component';
import {RegisterComponent} from '@modules/register/register.component';
import {DashboardComponent} from '@pages/dashboard/dashboard.component';
import {AuthGuard} from '@guards/auth.guard';
import {NonAuthGuard} from '@guards/non-auth.guard';
import {ForgotPasswordComponent} from '@modules/forgot-password/forgot-password.component';
import {RecoverPasswordComponent} from '@modules/recover-password/recover-password.component';
import {PrivacyPolicyComponent} from '@modules/privacy-policy/privacy-policy.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'admin',
        component: MainComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'blank',
                component: BlankComponent
            },
            {
                path: 'users',
                loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule)
            },
            {
                path: 'faq',
                loadChildren: () => import('./pages/faq/faq.module').then(m => m.FaqModule)
            },
            {
                path: 'cms',
                loadChildren: () => import('./pages/cms/cms.module').then(m => m.CmsModule)
            },
            {
                path: 'site-settings',
                loadChildren: () => import('./pages/site-settings/site-settings.module').then(m => m.SiteSettingsModule)
            },
            {
                path: 'departments',
                loadChildren: () => import('./pages/department/department.module').then(m => m.DepartmentModule)
            },
            {
                path: 'departments/:departmentId/categories',
                loadChildren: () => import('./pages/category/category.module').then(m => m.CategoryModule)
            },
            {
                path: 'products',
                loadChildren: () => import('./pages/product/product.module').then(m => m.ProductModule)
            },
            {
                path: 'coupons',
                loadChildren: () => import('./pages/coupons/coupons.module').then(m => m.CouponsModule)
            },
            {
                path: 'orders',
                loadChildren: () => import('./pages/order/order.module').then(m => m.OrderModule)
            },
            {
                path: '',
                component: DashboardComponent
            },
        ]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'recover-password',
        component: RecoverPasswordComponent,
        canActivate: [NonAuthGuard]
    },
    {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
        canActivate: [NonAuthGuard]
    },
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {relativeLinkResolution: 'legacy'})],
    exports: [RouterModule]
})
export class AppRoutingModule {}
