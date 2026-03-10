import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  CreateSnippetDto,
  PaginatedSnippetsResponseDto,
  SnippetResponseDto,
  UpdateSnippetDto,
} from './dto';
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

    const plainSnippet = snippet.toObject ? snippet.toObject() : snippet;

    const dto = plainToInstance(SnippetResponseDto, plainSnippet, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      data: dto,
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

    const plainData = result.data.map((item) =>
      item.toObject ? item.toObject() : item,
    );

    const dtoData = plainToInstance(SnippetResponseDto, plainData, {
      excludeExtraneousValues: true,
    });

    const paginatedDto = plainToInstance(
      PaginatedSnippetsResponseDto,
      {
        data: dtoData,
        page: result.page,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
      },
      {
        excludeExtraneousValues: true,
      },
    );

    return {
      success: true,
      ...paginatedDto,
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

    if (!snippet) {
      throw new NotFoundException('Snippet not found');
    }

    const plainSnippet = snippet.toObject ? snippet.toObject() : snippet;

    const dto = plainToInstance(SnippetResponseDto, plainSnippet, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      data: dto,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSnippetDto: UpdateSnippetDto,
  ) {
    const snippet = await this.snippetsService.update(id, updateSnippetDto);

    const plainSnippet = snippet.toObject ? snippet.toObject() : snippet;

    const dto = plainToInstance(SnippetResponseDto, plainSnippet, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      data: dto,
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
