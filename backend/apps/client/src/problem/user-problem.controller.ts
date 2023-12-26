import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req
} from '@nestjs/common'
import { Prisma, Role } from '@prisma/client'
import { JsonArray } from '@prisma/client/runtime/library'
import { AuthenticatedRequest, UseRolesGuard } from '@libs/auth'
import { ForbiddenAccessException } from '@libs/exception'
import { UserProblemService } from './problem.service'

@Controller('user/problem/:problemId')
@UseRolesGuard(Role.User)
export class UserProblemController {
  private readonly logger = new Logger(UserProblemController.name)

  constructor(private readonly userProblemService: UserProblemService) {}

  @Get()
  async getUserCode(
    @Req() req: AuthenticatedRequest,
    @Param('problemId', ParseIntPipe) problemId: number
  ) {
    try {
      return await this.userProblemService.getUserCode(req.user.id, problemId)
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.name === 'NotFoundError'
      ) {
        throw new NotFoundException(err.message)
      } else if (err instanceof ForbiddenAccessException) {
        throw new BadRequestException(err.message)
      }
      this.logger.error(err.message, err.stack)
      throw new InternalServerErrorException()
    }
  }

  @Post()
  async createUserCode(
    @Req() req: AuthenticatedRequest,
    @Body() template: JsonArray,
    @Param('problemId') problemId: number
  ) {
    try {
      return await this.userProblemService.createUserCode(
        req.user.id,
        template,
        problemId
      )
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new BadRequestException(err.message)
      }
      this.logger.error(err.message, err.stack)
      throw new InternalServerErrorException()
    }
  }

  @Put()
  async updateUserCode(
    @Req() req: AuthenticatedRequest,
    @Body() template: JsonArray,
    @Param('problemId') problemId: number
  ) {
    try {
      return await this.userProblemService.updateUserCode(
        req.user.id,
        template,
        problemId
      )
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new BadRequestException(err.message)
      }
      this.logger.error(err.message, err.stack)
      throw new InternalServerErrorException()
    }
  }
}
