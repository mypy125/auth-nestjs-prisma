import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../common/jwt-auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

describe('UserController', () => {
  let app: INestApplication;
  let userService: UserService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        NestConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
      ],
      controllers: [UserController],
      providers: [
        UserService,
        PrismaService,
        {
          provide: JwtService,
          useFactory: (configService: ConfigService) => {
            return new JwtService({
              secret: configService.get<string>('SECRET_KEY'),
            });
          },
          inject: [ConfigService],
        },
        {
          provide: JwtAuthGuard,
          useValue: {
            canActivate: jest.fn(() => true),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userService = app.get<UserService>(UserService);
    jwtService = app.get<JwtService>(JwtService);
  });

  describe('POST /user', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      };

      jest.spyOn(userService, 'create').mockResolvedValue({
        id: 1,
        ...createUserDto,
      } as any);

      const response = await request(app.getHttpServer())
        .post('/user')
        .send(createUserDto)
        .expect(201);

      expect(response.body.username).toBe('testuser');
      expect(response.body.email).toBe('testuser@example.com');
    });

    it('should throw BadRequestException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      };

      jest
        .spyOn(userService, 'create')
        .mockRejectedValue(
          new BadRequestException('User with this username already exists'),
        );

      const response = await request(app.getHttpServer())
        .post('/user')
        .send(createUserDto)
        .expect(400);

      expect(response.body.message).toBe(
        'User with this username already exists',
      );
    });
  });

  describe('GET /user/:id', () => {
    it('should return user if authorized', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'testuser@example.com',
      };

      const token = jwtService.sign({
        id: mockUser.id,
        username: mockUser.username,
      });

      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser as any);

      const response = await request(app.getHttpServer())
        .get('/user/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.username).toBe('testuser');
      expect(response.body.email).toBe('testuser@example.com');
    });

    it('should throw ForbiddenException if user tries to access another user', async () => {
      const token = jwtService.sign({
        id: 2,
        username: 'anotheruser',
      });

      const response = await request(app.getHttpServer())
        .get('/user/1')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body.message).toBe(
        'You are not authorized to view this user',
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const token = jwtService.sign({
        id: 1,
        username: 'testuser',
      });

      jest.spyOn(userService, 'findOne').mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .get('/user/999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });
  });

  describe('PUT /user/:id', () => {
    it('should update user if authorized', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'updateduser',
        email: 'updateduser@example.com',
      };

      const token = jwtService.sign({
        id: 1,
        username: 'testuser',
      });

      jest.spyOn(userService, 'update').mockResolvedValue({
        id: 1,
        ...updateUserDto,
      } as any);

      const response = await request(app.getHttpServer())
        .put('/user/1')
        .set('Authorization', `Bearer ${token}`)
        .send(updateUserDto)
        .expect(200);

      expect(response.body.username).toBe('updateduser');
      expect(response.body.email).toBe('updateduser@example.com');
    });

    it('should throw ForbiddenException if user tries to update another user', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'updateduser',
        email: 'updateduser@example.com',
      };

      const token = jwtService.sign({
        id: 2,
        username: 'anotheruser',
      });

      const response = await request(app.getHttpServer())
        .put('/user/1')
        .set('Authorization', `Bearer ${token}`)
        .send(updateUserDto)
        .expect(403);

      expect(response.body.message).toBe(
        'You are not authorized to update this user',
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'updateduser',
        email: 'updateduser@example.com',
      };

      const token = jwtService.sign({
        id: 1,
        username: 'testuser',
      });

      jest.spyOn(userService, 'update').mockResolvedValue(null);

      const response = await request(app.getHttpServer())
        .put('/user/999')
        .set('Authorization', `Bearer ${token}`)
        .send(updateUserDto)
        .expect(404);

      expect(response.body.message).toBe('User not found');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
