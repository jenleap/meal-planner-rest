import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.register({email: '1234@email.com', name: 'mockUser', password: 'Password'});

    expect(user.password).not.toEqual('Password');
    const [ salt, hash ] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

});
