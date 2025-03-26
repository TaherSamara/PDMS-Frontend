import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const API_BASE_URL = `${environment.baseUrl}/api/`;

@Injectable({
	providedIn: 'root'
})
export class ApiService {

	// Dashboard
	public dashboard = {
		statistics: API_BASE_URL + 'dashboard/statistics',
		statisticsByMonth: API_BASE_URL + 'dashboard/statistics-by-month',
	};

	// Users
	public users = {
		list: API_BASE_URL + 'users/list',
		details: (id: number) => API_BASE_URL + 'users/details/' + id,

		add: API_BASE_URL + 'users/add',
		edit: (id: number) => API_BASE_URL + 'users/edit/' + id,
		delete: (id: number) => API_BASE_URL + 'users/delete/' + id,
		active: (id: number) => API_BASE_URL + 'users/active/' + id,
		invite: (id: number) => API_BASE_URL + 'users/invite/' + id,
		editProfile: (id: number) => API_BASE_URL + 'users/edit-profile/' + id,
		resetPassword: (id: number) => API_BASE_URL + 'users/reset-password/' + id,
		refresh: API_BASE_URL + 'users/refresh'
	};

	// Devices
	public devices = {
		list: API_BASE_URL + 'devices/list',

		add: API_BASE_URL + 'devices/add',
		edit: (id: number) => API_BASE_URL + 'devices/edit/' + id,
		delete: (id: number) => API_BASE_URL + 'devices/delete/' + id,
		import: API_BASE_URL + 'devices/import',
	};

	// Map
	public map = {
		list: API_BASE_URL + 'map/list',
	};

	// Roles
	public roles = {
		list: API_BASE_URL + 'roles/list',

		add: API_BASE_URL + 'roles/add',
		edit: (id: number) => API_BASE_URL + 'roles/edit/' + id,
		details: (id: number) => API_BASE_URL + 'roles/details/' + id,
		delete: (id: number) => API_BASE_URL + 'roles/delete/' + id,
	};

	// Settings
	public settings = {
		list: API_BASE_URL + 'settings/list',
		edit: API_BASE_URL + 'settings/edit'
	};

	// Common
	public common = {
		permissions: API_BASE_URL + 'common/permissions',
		lookups: API_BASE_URL + 'common/lookups'
	};
}
