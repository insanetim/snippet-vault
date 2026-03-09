import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SnippetType } from '../enums/snippet-type.enum';

export type SnippetDocument = HydratedDocument<Snippet>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Snippet {
  @Prop({
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title must be at least 1 character long'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  })
  title: string;

  @Prop({
    required: [true, 'Content is required'],
    trim: true,
    minlength: [1, 'Content must be at least 1 character long'],
  })
  content: string;

  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: function (tags: string[]) {
        return tags.every(
          (tag) => typeof tag === 'string' && !tag.includes(' '),
        );
      },
      message: 'Tags cannot contain spaces',
    },
    set: function (tags: string[]) {
      return tags.map((tag) => tag.toLowerCase().trim());
    },
  })
  tags: string[];

  @Prop({
    required: [true, 'Type is required'],
    enum: SnippetType,
    default: SnippetType.NOTE,
  })
  type: SnippetType;
}

export const SnippetSchema = SchemaFactory.createForClass(Snippet);

SnippetSchema.index(
  { title: 'text', content: 'text' },
  {
    weights: { title: 3, content: 1 },
    name: 'snippet_text_search',
    default_language: 'english',
  },
);

SnippetSchema.index({ createdAt: -1 });
