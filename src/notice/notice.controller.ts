import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateNoticeDto } from './dto/createNotice.dto';
import { NoticeService } from './notice.service';
import { IdPGuard, IdPOptionalGuard } from 'src/user/guard/idp.guard';
import { GetAllNoticeQueryDto } from './dto/getAllNotice.dto';
import { GetUser } from 'src/user/decorator/get-user.decorator';
import { User } from 'src/global/entity/user.entity';

@Controller('notice')
@UsePipes(new ValidationPipe({ transform: true }))
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  //notice 전체 목록 조회 (페이지네이션 o)
  @Get('all')
  @UseGuards(IdPOptionalGuard)
  async getNoticeList(
    @Query() getAllNoticeQueryDto: GetAllNoticeQueryDto,
    @GetUser() user?: User,
  ) {
    return this.noticeService.getNoticeList(getAllNoticeQueryDto, user?.uuid);
  }

  //notice 상세 조회
  @Get(':id')
  @UseGuards(IdPOptionalGuard)
  async getNotice(@Param('id') id: number, @GetUser() user?: User) {
    return this.noticeService.getNotice(id, user);
  }

  //notice 생성
  @Post()
  @UseGuards(IdPGuard)
  async createNotice(
    @GetUser() user: User,
    @Body() createNoticeDto: CreateNoticeDto,
  ) {
    return this.noticeService.createNotice(createNoticeDto, user.uuid);
  }

  //notice 구독자 추가 **notice 수정이 아니므로 작성자가 아니어도 가능**
  @Post(':id/reminder')
  @UseGuards(IdPGuard)
  async addNoticeReminder(@GetUser() user: User, @Param('id') id: number) {
    return this.noticeService.addNoticeReminder(id, user);
  }

  @Delete(':id/reminder')
  @UseGuards(IdPGuard)
  async removeNoticeReminder(@GetUser() user: User, @Param('id') id: number) {
    return this.noticeService.removeNoticeReminder(id, user);
  }

  //notice 삭제, 수정은 작성자만 가능
  @Delete(':id')
  @UseGuards(IdPGuard)
  async deleteNotice(
    @GetUser() user: User,
    @Param('id') id: number,
  ): Promise<void> {
    return this.noticeService.deleteNotice(id, user.uuid);
  }
}
