import ApiService from '../api/ApiService';

export default class ContentService {
  static async create(data: any): Promise<any> {
    // Se precisar adicionar cabeçalhos específicos, você pode fazer isso aqui
    const headers = {
      'Content-Type': 'multipart/form-data'
    };
    return ApiService.post<any>('content/create', data, headers);
  }
}
