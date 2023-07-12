import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHelloMessage(): string {
    return "Welcome ChatGPT API Server!!";
  }
}
