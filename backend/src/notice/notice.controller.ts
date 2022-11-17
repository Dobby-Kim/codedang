import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  UseGuards,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common'
import { NoticeService } from './notice.service'
import { Notice } from '@prisma/client'
import { Public } from 'src/common/decorator/public.decorator'
import { RolesGuard } from 'src/user/guard/roles.guard'
import { GroupMemberGuard } from 'src/group/guard/group-member.guard'
import { UserNotice } from './interface/user-notice.interface'
import { EntityNotExistException } from 'src/common/exception/business.exception'

@Controller('notice')
@Public()
export class PublicNoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  async getNotices(
    @Query('offset', ParseIntPipe) offset: number
  ): Promise<Partial<Notice>[]> {
    return await this.noticeService.getNoticesByGroupId(1, offset)
  }

  @Get(':id')
  async getNotice(@Param('id', ParseIntPipe) id: number): Promise<UserNotice> {
    try {
      return await this.noticeService.getNotice(id, 1)
    } catch (error) {
      if (error instanceof EntityNotExistException) {
        throw new NotFoundException(error.message)
      }
      throw new InternalServerErrorException()
    }
  }
}

@Controller('group/:groupId/notice')
@UseGuards(RolesGuard, GroupMemberGuard)
export class GroupNoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  async getNotices(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Query('offset', ParseIntPipe) offset: number
  ): Promise<Partial<Notice>[]> {
    return await this.noticeService.getNoticesByGroupId(groupId, offset)
  }

  @Get(':id')
  async getNotice(
    @Param('id', ParseIntPipe) id: number,
    @Param('groupId', ParseIntPipe) groupId: number
  ): Promise<UserNotice> {
    try {
      return await this.noticeService.getNotice(id, groupId)
    } catch (error) {
      if (error instanceof EntityNotExistException) {
        throw new NotFoundException(error.message)
      }
      throw new InternalServerErrorException()
    }
  }
}