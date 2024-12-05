import { UserService } from '../../user/user.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

jest.mock('bcryptjs', () => ({
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(() => {
    userService = { findByUsername: jest.fn() } as any;
    jwtService = { sign: jest.fn() } as any;
    authService = new AuthService(userService, jwtService);
  });

  it('should login successfully', async () => {
    const user = {
      id: 1,
      username: 'test',
      password: 'hashedpassword',
      email: 'test@example.com',
    };
    const dto = { username: 'test', password: 'password' };

    jest.spyOn(userService, 'findByUsername').mockResolvedValue(user);

    jest.spyOn(jwtService, 'sign').mockReturnValue('token');

    const result = await authService.login(dto);
    expect(result).toEqual({ assess_token: 'token' });
  });
});
