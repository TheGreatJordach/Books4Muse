import { Controller, Get } from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('file')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @Get('merge-docs')
  async mergeDocs(): Promise<string> {
    await this.fileService.mergeDocs();
    return 'Docs merged and changes pushed successfully!';
  }
}
