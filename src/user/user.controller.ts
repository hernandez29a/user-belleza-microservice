import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserMSG } from 'src/common/constants';
import { PaginationDto } from 'src/common/dto/paginationDto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(UserMSG.CREATE)
  create(@Payload() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @MessagePattern(UserMSG.REGISTER)
  register(@Payload() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @MessagePattern(UserMSG.FIND_ALL)
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @MessagePattern(UserMSG.FIND_ONE)
  findOne(@Payload() id: string) {
    return this.userService.findOne(id);
  }

  @MessagePattern(UserMSG.UPDATE)
  update(@Payload() payload: any) {
    return this.userService.update(payload.id, payload.updateUserDto);
  }

  @MessagePattern(UserMSG.DELETE)
  remove(@Payload() id: string) {
    return this.userService.remove(id);
  }

  @MessagePattern(UserMSG.GET_EMAIL)
  getEmail(@Payload() data: { email: string; password: string }) {
    //console.log(data);
    //return 'dentro del login';
    return this.userService.getEmail(data);
  }
}
