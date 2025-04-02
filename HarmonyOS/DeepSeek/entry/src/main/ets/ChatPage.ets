import { DeepSeekService } from './services/deepseek/DeepSeekService';

// 1. 定义消息类型类替代对象字面量类型
class ConversationItem {
  role: string;
  content: string;

  constructor(role: string, content: string) {
    this.role = role;
    this.content = content;
  }
}

@Entry
@Component
export struct ChatPage {
  @State message: string = '';
  @State response: string = '等待提问...';
  @State isLoading: boolean = false;
  @State conversation: ConversationItem[] = [];

  // 2. 明确指定事件参数类型
  private handleInputChange(value: string): void {
    this.message = value;
  }

  // 3. 类型化的发送方法
  private async sendMessage(): Promise<void> {
    if (!this.message.trim()) return;

    this.isLoading = true;
    const userMessage = this.message;
    this.conversation.push(new ConversationItem('user', userMessage));
    this.message = '';

    try {
      const aiResponse = await DeepSeekService.sendRequest(userMessage);
      this.conversation.push(new ConversationItem('assistant', aiResponse));
      this.response = aiResponse;
    } catch (e) {
      const error = e as Error;
      this.conversation.push(new ConversationItem('assistant', `请求出错: ${error.message}`));
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 4. 类型安全的列表渲染
      List({ space: 10 }) {
        ForEach(this.conversation, (item: ConversationItem) => {
          ListItem() {
            Column() {
              Text(`${item.role}:`)
                .fontColor(item.role === 'user' ? '#007AFF' : '#FF9500')
                .fontSize(14)
              Text(item.content)
                .fontSize(16)
                .margin({ top: 4 })
                .width('100%')
            }
            .width('90%')
            .padding(10)
            .backgroundColor(item.role === 'user' ? '#F0F0F0' : '#E6F2FF')
            .borderRadius(8)
          }
        }, (item: ConversationItem) => JSON.stringify(item))
      }
      .layoutWeight(1)
      .width('100%')

      // 5. 输入区域
      Row() {
        TextInput({ placeholder: '输入你的问题...', text: this.message })
          .onChange((value: string) => this.handleInputChange(value))
          .height(50)
          .layoutWeight(1)
          .border({ width: 1, color: '#CCCCCC', radius: 20 })

        Button('发送')
          .onClick(() => this.sendMessage())
          .height(50)
          .margin({ left: 8 })
          .backgroundColor('#007AFF')
          .enabled(!this.isLoading)
      }
      .width('90%')
      .margin({ bottom: 10 })

      if (this.isLoading) {
        Progress({value:0})
          .width('80%')
          .margin({ bottom: 10 })
      }
    }
    .width('100%')
    .height('100%')
    .padding(10)
    .backgroundColor('#FFFFFF')
  }
}