if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ChatPage_Params {
    message?: string;
    response?: string;
    isLoading?: boolean;
    conversation?: ConversationItem[];
}
import { DeepSeekService } from "@normalized:N&&&entry/src/main/ets/services/deepseek/DeepSeekService&";
// 1. 定义消息类型类替代对象字面量类型
class ConversationItem {
    role: string;
    content: string;
    constructor(role: string, content: string) {
        this.role = role;
        this.content = content;
    }
}
export class ChatPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__message = new ObservedPropertySimplePU('', this, "message");
        this.__response = new ObservedPropertySimplePU('等待提问...', this, "response");
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__conversation = new ObservedPropertyObjectPU([], this, "conversation");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ChatPage_Params) {
        if (params.message !== undefined) {
            this.message = params.message;
        }
        if (params.response !== undefined) {
            this.response = params.response;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.conversation !== undefined) {
            this.conversation = params.conversation;
        }
    }
    updateStateVars(params: ChatPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__message.purgeDependencyOnElmtId(rmElmtId);
        this.__response.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__conversation.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__message.aboutToBeDeleted();
        this.__response.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__conversation.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __message: ObservedPropertySimplePU<string>;
    get message() {
        return this.__message.get();
    }
    set message(newValue: string) {
        this.__message.set(newValue);
    }
    private __response: ObservedPropertySimplePU<string>;
    get response() {
        return this.__response.get();
    }
    set response(newValue: string) {
        this.__response.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __conversation: ObservedPropertyObjectPU<ConversationItem[]>;
    get conversation() {
        return this.__conversation.get();
    }
    set conversation(newValue: ConversationItem[]) {
        this.__conversation.set(newValue);
    }
    // 2. 明确指定事件参数类型
    private handleInputChange(value: string): void {
        this.message = value;
    }
    // 3. 类型化的发送方法
    private async sendMessage(): Promise<void> {
        if (!this.message.trim())
            return;
        this.isLoading = true;
        const userMessage = this.message;
        this.conversation.push(new ConversationItem('user', userMessage));
        this.message = '';
        try {
            const aiResponse = await DeepSeekService.sendRequest(userMessage);
            this.conversation.push(new ConversationItem('assistant', aiResponse));
            this.response = aiResponse;
        }
        catch (e) {
            const error = e as Error;
            this.conversation.push(new ConversationItem('assistant', `请求出错: ${error.message}`));
        }
        finally {
            this.isLoading = false;
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.padding(10);
            Column.backgroundColor('#FFFFFF');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 4. 类型安全的列表渲染
            List.create({ space: 10 });
            // 4. 类型安全的列表渲染
            List.layoutWeight(1);
            // 4. 类型安全的列表渲染
            List.width('100%');
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                {
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        itemCreation2(elmtId, isInitialRender);
                        if (!isInitialRender) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        ListItem.create(deepRenderFunction, true);
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Column.create();
                            Column.width('90%');
                            Column.padding(10);
                            Column.backgroundColor(item.role === 'user' ? '#F0F0F0' : '#E6F2FF');
                            Column.borderRadius(8);
                        }, Column);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(`${item.role}:`);
                            Text.fontColor(item.role === 'user' ? '#007AFF' : '#FF9500');
                            Text.fontSize(14);
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(item.content);
                            Text.fontSize(16);
                            Text.margin({ top: 4 });
                            Text.width('100%');
                        }, Text);
                        Text.pop();
                        Column.pop();
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, this.conversation, forEachItemGenFunction, (item: ConversationItem) => JSON.stringify(item), false, false);
        }, ForEach);
        ForEach.pop();
        // 4. 类型安全的列表渲染
        List.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 5. 输入区域
            Row.create();
            // 5. 输入区域
            Row.width('90%');
            // 5. 输入区域
            Row.margin({ bottom: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '输入你的问题...', text: this.message });
            TextInput.onChange((value: string) => this.handleInputChange(value));
            TextInput.height(50);
            TextInput.layoutWeight(1);
            TextInput.border({ width: 1, color: '#CCCCCC', radius: 20 });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('发送');
            Button.onClick(() => this.sendMessage());
            Button.height(50);
            Button.margin({ left: 8 });
            Button.backgroundColor('#007AFF');
            Button.enabled(!this.isLoading);
        }, Button);
        Button.pop();
        // 5. 输入区域
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Progress.create({ value: 0 });
                        Progress.width('80%');
                        Progress.margin({ bottom: 10 });
                    }, Progress);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ChatPage";
    }
}
registerNamedRoute(() => new ChatPage(undefined, {}), "", { bundleName: "com.example.deepseek", moduleName: "entry", pagePath: "ChatPage", pageFullPath: "entry/src/main/ets/ChatPage", integratedHsp: "false", moduleType: "followWithHap" });
