import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateSnippetDto, UpdateSnippetDto } from './dto';
import { SnippetsService } from './snippets.service';

@Controller('snippets')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    disableErrorMessages: process.env.NODE_ENV === 'production',
  }),
)
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSnippetDto: CreateSnippetDto) {
    const snippet = await this.snippetsService.create(createSnippetDto);
    return {
      success: true,
      data: snippet,
      message: 'Snippet created successfully',
    };
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('q') q?: string,
    @Query('tag') tag?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const result = await this.snippetsService.findAll(pageNum, q, tag);

    return {
      success: true,
      ...result,
    };
  }

  @Get('tags')
  async getAllTags() {
    const tags = await this.snippetsService.getAllTags();
    return {
      success: true,
      data: tags,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const snippet = await this.snippetsService.findOne(id);
    return {
      success: true,
      data: snippet,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSnippetDto: UpdateSnippetDto,
  ) {
    const snippet = await this.snippetsService.update(id, updateSnippetDto);
    return {
      success: true,
      data: snippet,
      message: 'Snippet updated successfully',
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    const result = await this.snippetsService.remove(id);
    return {
      success: true,
      ...result,
    };
  }
}
