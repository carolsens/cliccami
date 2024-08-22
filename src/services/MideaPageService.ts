import ApiService from '../api/ApiService';

export default class MideaPageService {

  static async delete(id: string): Promise<any> {
    return ApiService.delete(`midea-page/${id}`);
  }

  static async create(midea: any, page: any): Promise<any> {
    return ApiService.post<any>('midea-page/create', { midea, page });
  }
}
