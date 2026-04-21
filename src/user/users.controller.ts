import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.services';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateUserDto } from './update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

@Get()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
findAll(
  @Query('page') page = '1',
  @Query('limit') limit = '10',
) {
  return this.usersService.findAll(+page, +limit);
}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
  @Param('id') id:string,
  @CurrentUser() user:any,)
  {return this.usersService.findOne(+id ,user)}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id:String ,
    @Body() dto:UpdateUserDto,
    @CurrentUser() user:any,
  ){
  return this.usersService.update(+id ,dto ,user)
}
  @Delete(':id')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles("admin")
  remove(
    @Param('id') id:String){
  return this.usersService.remove(+id)
}
}
