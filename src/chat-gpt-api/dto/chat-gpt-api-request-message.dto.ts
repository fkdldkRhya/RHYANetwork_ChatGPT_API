import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator"
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from "openai";

export class ChatGPTApiRequestMessageDTO {
    @IsNotEmpty()
    @IsString()
    readonly accessKey: string;
    
    @IsNotEmpty()
    @IsArray()
    readonly message: ChatCompletionRequestMessage[];
}