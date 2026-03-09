import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SnippetsModule } from './snippets/snippets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: 'snippet-vault',
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('MongoDB connected successfully');
          });
          connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
          });
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    SnippetsModule,
  ],
})
export class AppModule {}
