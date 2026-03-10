import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ValidateObjectId } from '../decorators/validate-object-id.decorator';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { Snippet } from './schemas/snippet.schema';

@Injectable()
export class SnippetsService {
  private readonly DEFAULT_LIMIT = 10;

  constructor(
    @InjectModel(Snippet.name) private snippetModel: Model<Snippet>,
  ) {}

  async create(createSnippetDto: CreateSnippetDto): Promise<Snippet> {
    try {
      const created = new this.snippetModel({
        ...createSnippetDto,
        tags: createSnippetDto.tags?.map((tag) => tag.toLowerCase().trim()),
      });
      return await created.save();
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(`Validation failed: ${error.message}`);
      }
      throw error;
    }
  }

  async findAll(page: number = 1, q?: string, tag?: string) {
    const limit = this.DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (q && q.trim()) {
      filter.$text = { $search: q.trim() };
    }

    if (tag && tag.trim()) {
      filter.tags = tag.toLowerCase().trim();
    }

    try {
      const [data, totalCount] = await Promise.all([
        this.snippetModel
          .find(filter)
          .skip(skip)
          .limit(limit)
          .sort({
            ...(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 }),
          })
          .select('-__v')
          .exec(),
        this.snippetModel.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        data,
        page,
        totalPages,
        totalCount,
      };
    } catch (error) {
      throw error;
    }
  }

  @ValidateObjectId
  async findOne(id: string): Promise<Snippet> {
    const snippet = await this.snippetModel.findById(id).select('-__v').exec();

    if (!snippet) {
      throw new NotFoundException(`Snippet with ID ${id} not found`);
    }

    return snippet;
  }

  @ValidateObjectId
  async update(
    id: string,
    updateSnippetDto: UpdateSnippetDto,
  ): Promise<Snippet> {
    if (updateSnippetDto.tags) {
      updateSnippetDto.tags = updateSnippetDto.tags.map((tag) =>
        tag.toLowerCase().trim(),
      );
    }

    const updated = await this.snippetModel
      .findByIdAndUpdate(id, updateSnippetDto, {
        new: true,
        runValidators: true,
      })
      .select('-__v')
      .exec();

    if (!updated) {
      throw new NotFoundException(`Snippet with ID ${id} not found`);
    }

    return updated;
  }

  @ValidateObjectId
  async remove(id: string): Promise<{ deleted: boolean; message: string }> {
    const result = await this.snippetModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Snippet with ID ${id} not found`);
    }

    return {
      deleted: true,
      message: 'Snippet successfully deleted',
    };
  }

  async getAllTags(): Promise<string[]> {
    const tags = await this.snippetModel.distinct('tags').exec();
    return tags.sort();
  }
}
