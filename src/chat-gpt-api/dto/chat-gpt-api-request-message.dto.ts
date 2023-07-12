import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator"
import { ChatCompletionRequestMessageRoleEnum } from "openai";

export class ChatGPTApiRequestMessageDTO {
    @IsNotEmpty()
    @IsString()
    readonly accessKey: string;

    @IsNotEmpty()
    @IsEnum(ChatCompletionRequestMessageRoleEnum)
    readonly role: ChatCompletionRequestMessageRoleEnum;

    @IsNotEmpty()
    @IsString()
    @MaxLength(500)
    readonly message: string;
}