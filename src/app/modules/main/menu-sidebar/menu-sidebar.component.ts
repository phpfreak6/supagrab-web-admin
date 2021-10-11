import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from '@services/app.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-menu-sidebar',
    templateUrl: './menu-sidebar.component.html',
    styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit, OnDestroy {
    public user;

    constructor(
        public appService: AppService,
        public activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.user = this.appService.user;
    }

    public ngOnDestroy(): void {}
}
