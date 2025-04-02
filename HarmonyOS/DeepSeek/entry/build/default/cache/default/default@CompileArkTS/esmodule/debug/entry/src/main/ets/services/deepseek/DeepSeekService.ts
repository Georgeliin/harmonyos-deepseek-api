import http from "@ohos:net.http";
import type { BusinessError } from "@ohos:base";
// 1. 定义所有需要的类型类
class ChatMessage {
    role: string = '';
    content: string = '';
    constructor(role: string, content: string) {
        this.role = role;
        this.content = content;
    }
}
class Choice {
    message: ChatMessage = new ChatMessage('', '');
}
class ApiResponse {
    choices: Choice[] = [];
}
class RequestHeader {
    'Content-Type': string = 'application/json';
    'Authorization': string = '';
    constructor(apiKey: string) {
        this.Authorization = `Bearer ${apiKey}`;
    }
}
class RequestBody {
    model: string = '';
    messages: ChatMessage[] = [];
    temperature: number = 0.7;
    constructor(model: string, messages: ChatMessage[]) {
        this.model = model;
        this.messages = messages;
    }
}
class RequestConfig {
    method: http.RequestMethod = http.RequestMethod.POST;
    header: RequestHeader;
    extraData: string;
    constructor(header: RequestHeader, body: RequestBody) {
        this.header = header;
        this.extraData = JSON.stringify(body);
    }
}
export class DeepSeekService {
    private static readonly BASE_URL: string = 'https://api.deepseek.com';
    private static readonly API_KEY: string = 'sk-b378cd5b16c843389060324840caeeda';
    static async sendRequest(prompt: string, model: string = 'deepseek-chat'): Promise<string> {
        const httpRequest = http.createHttp();
        try {
            // 2. 使用类实例替代所有对象字面量
            const requestMessage = new ChatMessage('user', prompt);
            const requestBody = new RequestBody(model, [requestMessage]);
            const requestHeader = new RequestHeader(DeepSeekService.API_KEY);
            const config = new RequestConfig(requestHeader, requestBody);
            // 3. 类型安全的HTTP请求
            const response: http.HttpResponse = await new Promise((resolve, reject) => {
                httpRequest.request(`${DeepSeekService.BASE_URL}/chat/completions`, config, (err: BusinessError, data: http.HttpResponse) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
            if (response.responseCode === 200) {
                const result: ApiResponse = JSON.parse(response.result.toString());
                return result.choices[0].message.content;
            }
            else {
                throw new Error(`API请求失败: ${response.responseCode}`);
            }
        }
        catch (error) {
            const err = error as BusinessError;
            console.error(`请求DeepSeek API出错: ${JSON.stringify(err)}`);
            throw new Error(`请求失败: ${err.message}`);
        }
        finally {
            httpRequest.destroy();
        }
    }
}
