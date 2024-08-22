import ApiService from '../api/ApiService';

export default class AccountService {
  static async create(data: any): Promise<any> {
    return ApiService.post<any>('account/create', data);
  }
}





