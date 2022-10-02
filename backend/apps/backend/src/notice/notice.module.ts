import { Module } from '@nestjs/common'
import {
  PublicNoticeController,
  GroupNoticeController
} from './notice.controller'
import {
  NoticeAdminController,
  GroupNoticeAdminController
} from './notice-admin.controller'
import { NoticeService } from './notice.service'
import { GroupModule } from 'src/group/group.module'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [UserModule, GroupModule],
  controllers: [
    PublicNoticeController,
    GroupNoticeController,
    NoticeAdminController,
    GroupNoticeAdminController
  ],
  providers: [NoticeService]
})
export class NoticeModule {}