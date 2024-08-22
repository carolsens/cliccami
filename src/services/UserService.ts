import ApiService from '../api/ApiService';

export default class UserService {

  static async updateStatus(id: any, status: any): Promise<any> {
    return ApiService.post<any>('user/update/status', {id, status});
  }
  static async list(): Promise<any> {
    return ApiService.get<any>('user');
  }


}
