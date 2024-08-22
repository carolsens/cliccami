import ApiService from '../api/ApiService';

export default class PageService {
  static async list(): Promise<any> {
    return ApiService.get<any>('page');
  }
}
