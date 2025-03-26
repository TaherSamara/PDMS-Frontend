import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { TextLengthPipe } from '../pipe/max-length.pipe';
import { PaginationComponent } from './pagination/pagination.component';
import { NoResultsComponent } from './no-results/no-results.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DeleteComponent } from './delete/delete.component';
import { ImportComponent } from './import/import.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapComponent } from './google-map/google-map.component';

@NgModule({
    declarations: [
        TextLengthPipe,
        PaginationComponent,
        NoResultsComponent,
        DeleteComponent,
        ImportComponent,
        GoogleMapComponent
    ],
    imports: [
        CommonModule,
        NgxPaginationModule,
        RouterModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        NgxSkeletonLoaderModule,
        GoogleMapsModule
    ],
    exports: [
        TextLengthPipe,
        PaginationComponent,
        NoResultsComponent,
        GoogleMapComponent
    ]
})
export class SharedModule { }
