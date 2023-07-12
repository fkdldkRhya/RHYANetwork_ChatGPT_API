import { PrismaClient } from "@prisma/client";
import { Optional, OptionalResult } from "../dto/optional.dto";
import * as moment from 'moment';

export interface AccessKeyLimitInfoInterface {
    id: number;
    limit_type: "DISABLE" | "DAY" | "MONTH";
    limit_value: number;
    limit_current: number;
    limit_reset: Date;
}

export async function checkAuthorizationHeaderValue(prisma : PrismaClient, accessKey: string) : Promise<Optional<boolean>> {
    let result : Optional<boolean> = { result: OptionalResult.FAIL };

    try {
        const select = await prisma.chat_gpt_api_auth.findUnique({
            where: {
                key: accessKey
            }
        }).catch(error => {
            throw new Error(error);
        });

        switch (select.type) {
            case "DISABLE":
                result = {
                    result: OptionalResult.SUCCESS,
                    data: false,
                    message: "해당 ACCESS KEY가 존재하지 않거나 비활성화되었습니다."
                }
                
                break;
            
            case "DEFAULT":
            case "SYSTEM":
            case "OTHER": {
                switch (select.limit_type) {
                    case "DISABLE":
                        result = {
                            result: OptionalResult.SUCCESS,
                            data: true,
                            message: "ChatGPT API 요청이 허용된 ACCESS KEY입니다."
                        };

                        break;
                    
                    case "DAY":
                    case "MONTH": {
                        const limitInfo : Optional<AccessKeyLimitInfoInterface> = await getAccessKeyLimitInfo(prisma, accessKey);
        
                        if (limitInfo.result == OptionalResult.SUCCESS &&
                            limitInfo.data.limit_value > limitInfo.data.limit_current) {
                            result = {
                                result: OptionalResult.SUCCESS,
                                data: true,
                                message: "ChatGPT API 접근이 허용된 ACCESS KEY입니다."
                            };
                        }else {
                            result = {
                                result: OptionalResult.SUCCESS,
                                data: false,
                                message: "ChatGPT API 요청 허용량이 초과되었습니다."
                            };
                        }

                        break;
                    }
                }

                break;
            }
        }
    }catch(error: any) {
        result = {
            result: OptionalResult.FAIL,
            message: error.message
        }
    }

    return result;
}

export async function useAccessKey(prisma : PrismaClient, accessKey: string) : Promise<void> {
    try {
        const limitInfo : Optional<AccessKeyLimitInfoInterface> = await getAccessKeyLimitInfo(prisma, accessKey);
        if (limitInfo.result == OptionalResult.SUCCESS) {
            let isReset : boolean = false;

            switch (limitInfo.data.limit_type) {
                case "DAY": {
                    if (moment().diff(moment(limitInfo.data.limit_reset), 'day') >= 1) {
                        isReset = true;
                    }

                    break;
                }

                case "MONTH": {
                    if (moment().diff(moment(limitInfo.data.limit_reset), 'month') >= 1) {
                        isReset = true;
                    }

                    break;
                }
            }

            if (isReset) {
                await prisma.chat_gpt_api_auth.update({
                    data: {
                        limit_current: 0,
                        limit_reset: new Date(),
                    },
                    where: {
                        id: limitInfo.data.id,
                    },
                }).catch(error => {
                    throw new Error(error);
                });
            }

            if (limitInfo.data.limit_value > limitInfo.data.limit_current) {
                await prisma.chat_gpt_api_auth.update({
                    data: {
                        limit_current: {
                            increment: 1,
                        }
                    },
                    where: {
                        id: limitInfo.data.id,
                    },
                }).catch(error => {
                    throw new Error(error);
                });
            }
        }else {
            throw new Error("해당 ACCESS KEY가 존재하지 않거나 비활성화되었습니다.");
        }
    }catch(error: any) {
        console.log(error);
        throw new Error(error.message);
    }
}

export async function getAccessKeyLimitInfo(prisma : PrismaClient, accessKey: string) : Promise<Optional<AccessKeyLimitInfoInterface>> {
    let result : Optional<AccessKeyLimitInfoInterface> = { result: OptionalResult.FAIL };
    
    try {
        const select = await prisma.chat_gpt_api_auth.findUnique({
            where: {
                key: accessKey
            }
        }).catch(error => {
            throw new Error(error);
        });
    
        const max = select.limit_value;
        const current = select.limit_current;

        result = {
            result: OptionalResult.SUCCESS,
            data: {
                id: select.id,
                limit_type: select.limit_type,
                limit_value: max,
                limit_current: current,
                limit_reset: select.limit_reset,
            },
        };
    }catch(error: any) {
        result = {
            result: OptionalResult.FAIL,
            message: error.message
        }
    }

    return result;
}