import ApiService from '../api/ApiService';

export default class MideaService {
  static async list(): Promise<any> {
    return ApiService.get<any>('midea');
  }

  static async listName(): Promise<any> {
    return ApiService.get<any>('midea/name');
  }




  static async delete(id: string): Promise<any> {
    return ApiService.delete(`midea/${id}`);
  }
}
