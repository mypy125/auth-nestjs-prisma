import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../dto/auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call register method and return a user and token', async () => {
      const dto: RegisterDto = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password',
      };

      const result = {
        user: { id: 1, username: 'testuser', email: 'testuser@example.com' },
        token: 'jwt_token',
      };

      authService.register = jest.fn().mockResolvedValue(result);

      expect(await controller.register(dto)).toEqual(result);
      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(authService.register).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    it('should call login method and return a user and token', async () => {
      const dto: LoginDto = {
        username: 'testuser',
        password: 'password',
      };

      const result = {
        user: { id: 1, username: 'testuser', email: 'testuser@example.com' },
        token: 'jwt_token',
      };

      authService.login = jest.fn().mockResolvedValue(result);

      expect(await controller.login(dto)).toEqual(result);
      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(authService.login).toHaveBeenCalledTimes(1);
    });

    it('should throw error if credentials are incorrect', async () => {
      const dto: LoginDto = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      authService.login = jest
        .fn()
        .mockRejectedValue(new Error('Invalid credentials'));

      await expect(controller.login(dto)).rejects.toThrowError(
        'Invalid credentials',
      );
    });
  });
});
