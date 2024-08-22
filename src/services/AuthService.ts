import ApiService from '../api/ApiService';

export default class AuthService {
  static async login(email: string, password: string): Promise<any> {
    return ApiService.post<any>('login', { email, password });
  }
}
