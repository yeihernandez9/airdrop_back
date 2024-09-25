import { Injectable } from '@nestjs/common';

@Injectable()
export class SharedService {
  async camelize(str: string): Promise<string> {
    return str.replace(/\b\w/g, (l) => l.toUpperCase());
  }
}