import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from 'src/common/dto/paginationDto';

@Injectable()
export class UserService {
  constructor(
    // ? Patron Repositorio
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { password, ...restoData } = createUserDto;

    //restoData.name = restoData.name.toLocaleLowerCase();
    //restoData.lastname = restoData.lastname.toLocaleLowerCase();
    restoData.status = true;

    try {
      const user = await this.userModel.create({
        ...restoData,
        password: bcrypt.hashSync(password, 10),
      });

      // ? retornar el jwt de acceso
      return {
        user,
        //token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBException(error);
      //this.errorHandler.errorHandleException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 1 } = paginationDto;
    const pagination = (offset - 1) * limit;
    const termino = paginationDto.term;
    const regex = new RegExp(termino, 'i');
    const [total, users] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel
        .find()
        .limit(limit)
        .skip(pagination)
        .select('-__v')
        .or([{ name: regex }, { email: regex }]),
      //.where({ name: termino.toLocaleLowerCase().trim() }),
    ]);
    const totalpages = Math.ceil((total * 1) / limit);
    const paginating = {
      before: offset - 1,
      current: offset,
      after: offset + 1,
      total,
      totalpages,
    };
    return { users, paginating };
    //return `This action returns all user`;
  }

  async findOne(id: string): Promise<User> {
    let user: User;

    if (!user && isValidObjectId(id)) {
      user = await this.userModel.findById(id);
    }

    if (!user) {
      throw new NotFoundException(
        `User with id, name: ${id} it's not in the bd`,
      );
    }

    return user;
    //return `This action returns a #${id} user`;
  }

  // encriptar contraseña
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    //console.log(updateUserDto);
    //return 'todo esta biern';

    const { password, ...restoData } = updateUserDto;
    if (password) {
      const hash = await this.hashPassword(updateUserDto.password);
      updateUserDto.password = hash;
    }
    const user = { ...restoData };
    try {
      return await this.userModel.findByIdAndUpdate(id, user, { new: true });
    } catch (error) {
      this.handleDBException(error);
    }
  }

  // encriptar contraseña
  /*async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { ...restoData } = updateUserDto;
    console.log(updateUserDto.password);

    if (updateUserDto.password) {
      const hash = await this.hashPassword(restoData.password);
      restoData.password = hash;
    }
    const user = { ...restoData };
    return updateUserDto;
  }*/

  /*async update(id: string, updateUserDto: UpdateUserDto) {
    const { ...restoData } = updateUserDto;
    if (updateUserDto.password !== undefined) {
      const hash = await this.hashPassword(updateUserDto.password);
      restoData.password = hash;
    }
    const user = { ...restoData };
    try {
      console.log(restoData.password);
      return 'cambios realizados';
      //return await this.userModel.findByIdAndUpdate(id, user, { new: true });
    } catch (error) {
      this.handleDBException(error);
    }
  }*/

  /*async update(id: string, updateUserDto: UpdateUserDto) {
    const { ...restoData } = updateUserDto;
    if (updateUserDto.password) {
      const hash = await this.hashPassword(restoData.password);
      restoData.password = hash;
    }
    const user = { ...restoData };
    try {
      return await this.userModel.findByIdAndUpdate(id, user, { new: true });
    } catch (error) {
      this.handleDBException(error);
    }
  }*/

  async remove(id: string) {
    let user: User;

    try {
      user = await this.userModel.findByIdAndUpdate(
        id,
        { status: false },
        {
          new: true,
        },
      );
      return user;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    console.log(error);
    //console.log(error.index, error.code, error.keyPattern);
    if (error.code === '11000') {
      throw new BadRequestException(
        `user created ${JSON.stringify(error.keyPattern)}`,
      );
    }
    //this.logger.error(error);
    throw new BadRequestException(
      `user created ${JSON.stringify(error.keyValue)}`,
    );
  }
}
