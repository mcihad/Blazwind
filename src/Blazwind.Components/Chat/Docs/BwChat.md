# BwChat

A feature-rich internal messaging and support component designed for ticket systems, live support, or citizen
communication.

## Features

- ✅ **Message Bubbles**: Distinct styling for incoming and outgoing messages.
- ✅ **Avatars**: Support for sender avatars and online status indicators.
- ✅ **Timestamps & Grouping**: Smart message grouping by date.
- ✅ **Attachments**: Built-in support for displaying file attachments.
- ✅ **Typing Indicators**: Visual feedback when a participant is typing.
- ✅ **Read Status**: Optional checkmarks for message delivery and read status.
- ✅ **Mentions**: Integration with `@mentions` for tagging users.
- ✅ **Interactivity**: Support for sending messages, attaching files, and custom header actions.

## Usage

### Basic Messaging

```razor
<BwChat Messages="_messages" 
        Participant="_participant"
        Height="450px"
        OnSend="HandleSend" />

@code {
    private ChatParticipant _participant = new() { Name = "John Doe", IsOnline = true };
    private List<ChatMessage> _messages = new() {
        new() { SenderName = "John", Content = "Hello!", IsOwn = false },
        new() { SenderName = "Me", Content = "Hi John!", IsOwn = true }
    };
    
    private void HandleSend(string text) { /* Append to _messages */ }
}
```

### Floating Widget & Mention Support

```razor
<BwChat Messages="_messages" 
        Mentions="_userMentions"
        OnSend="HandleSend" />
```

## API Reference

### Parameters

| Parameter          | Type                  | Default               | Description                                                 |
|--------------------|-----------------------|-----------------------|-------------------------------------------------------------|
| `Messages`         | `List<ChatMessage>`   | `[]`                  | The list of messages to display.                            |
| `Participant`      | `ChatParticipant?`    | `null`                | Details of the other participant (shown in header).         |
| `Height`           | `string`              | `"500px"`             | The height of the chat container.                           |
| `InputPlaceholder` | `string`              | `"Type a message..."` | Text shown in the input area when empty.                    |
| `ShowHeader`       | `bool`                | `true`                | Whether to show the top header bar.                         |
| `ShowInput`        | `bool`                | `true`                | Whether to show the message input area.                     |
| `ShowAvatars`      | `bool`                | `true`                | Whether to show participant avatars next to messages.       |
| `ShowSenderName`   | `bool`                | `false`               | Whether to show names above incoming message bubbles.       |
| `ShowAttachButton` | `bool`                | `true`                | Whether to show the paperclip attachment button.            |
| `ShowReadStatus`   | `bool`                | `true`                | Whether to show read/delivery checkmarks.                   |
| `Mentions`         | `List<BwMentionItem>` | `[]`                  | List of items available for @mentions.                      |
| `HeaderContent`    | `RenderFragment?`     | `null`                | Custom content to inject into the right side of the header. |

### Event Callbacks

| Event           | Payload  | Description                                      |
|-----------------|----------|--------------------------------------------------|
| `OnSend`        | `string` | Triggered when the user sends a message.         |
| `OnAttachClick` | `none`   | Triggered when the attachment button is clicked. |

## Models

### ChatMessage

| Property       | Type                   | Description                                         |
|----------------|------------------------|-----------------------------------------------------|
| `Id`           | `string`               | Unique identifier for the message.                  |
| `SenderName`   | `string`               | Name of the sender.                                 |
| `SenderAvatar` | `string?`              | URL to the sender's avatar image.                   |
| `Content`      | `string`               | The text content of the message.                    |
| `Timestamp`    | `DateTime`             | When the message was sent.                          |
| `IsOwn`        | `bool`                 | Whether the message was sent by the current user.   |
| `Attachments`  | `List<ChatAttachment>` | List of file attachments.                           |
| `IsRead`       | `bool`                 | Whether the message has been read by the recipient. |

### ChatParticipant

| Property   | Type      | Description                                  |
|------------|-----------|----------------------------------------------|
| `Name`     | `string`  | The participant's display name.              |
| `Avatar`   | `string?` | URL to the participant's avatar.             |
| `IsOnline` | `bool`    | Whether the participant is currently online. |
| `IsTyping` | `bool`    | Whether the participant is currently typing. |
