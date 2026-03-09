import { Document } from 'mongoose';
import { SnippetType } from '../enums/snippet-type.enum';

export interface Snippet extends Document {
  title: string;
  content: string;
  tags: string[];
  type: SnippetType;
  createdAt: Date;
  updatedAt: Date;
}
