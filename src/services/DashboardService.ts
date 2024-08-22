import ApiService from '../api/ApiService';

export default class DashboardService {
  static async dashboard(): Promise<any> {
    return ApiService.get<any>('dashboard');
  }
}
