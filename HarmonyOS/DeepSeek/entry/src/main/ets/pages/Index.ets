import { ChatPage } from '../ChatPage';

@Entry
@Component
struct MyApplication {
  build() {
    Column() {
      ChatPage()
    }
    .width('100%')
    .height('100%')
  }
}