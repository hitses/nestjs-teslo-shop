import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/file-filter.helper';
import { diskStorage } from 'multer';
import { fileRename } from './helpers/file-rename.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/products',
        filename: fileRename,
      }),
    }),
  )
  uploadProductImage(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${
      file.filename
    }`;

    return {
      secureUrl,
    };
  }

  @Get('product/:imageName')
  findOne(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.filesService.findOne(imageName);

    res.sendFile(path);
  }
}
