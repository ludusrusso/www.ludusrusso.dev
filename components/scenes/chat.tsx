import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  split,
  useSubscription,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import styled from "@emotion/styled";
import gql from "graphql-tag";
import { Fragment, useState } from "react";

const wsLink = new WebSocketLink({
  uri: "wss://api.streamblitz.com/graphql",
  options: {
    reconnect: true,
  },
});

const httpLink = new HttpLink({
  uri: "https://api.streamblitz.com/graphql",
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

const COMMENTS_SUBSCRIPTION = gql`
  subscription TwitchChat($channel: String!) {
    message(channel: $channel) {
      id
      message
      author {
        username
        roles
      }
    }
  }
`;

interface ChatMessage {
  msg: string;
  author: string;
}

const MAX_CHAT_SIZE = 5;

interface ChatProps {
  twitchChannel: string;
}

const ChatBase = ({ twitchChannel }: ChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useSubscription(COMMENTS_SUBSCRIPTION, {
    variables: {
      channel: twitchChannel,
    },
    onSubscriptionData: (data) => {
      const newMsg: ChatMessage = {
        author: data.subscriptionData.data.message.author.username,
        msg: data.subscriptionData.data.message.message,
      };
      setMessages((msgs) => {
        if (msgs.length >= MAX_CHAT_SIZE) {
          msgs = msgs.slice(msgs.length - MAX_CHAT_SIZE + 1);
        }
        return [...msgs, newMsg];
      });
    },
  });

  return (
    <Fragment>
      <ChatList className="h-full overflow-hidden">
        {messages.map((msg, idx) => (
          <li key={idx}>
            <span className="author text-gray-100">{msg.author}</span>
            <span className="msg text-gray-400">{msg.msg}</span>
          </li>
        ))}
      </ChatList>
    </Fragment>
  );
};

const ChatList = styled.ul`
  display: flex;
  flex-direction: column;
  li {
    display: flex;
    color: white;
    font-size: 12pt;
    .author {
      font-weight: bold;
      margin-right: 10px;
      width: 200px;
      text-align: right;
    }
    .msg {
      width: 300px;
    }
  }
  li + li {
    margin-top: 5px;
  }
`;

const Chat = (props: ChatProps) => {
  return (
    <ApolloProvider client={apolloClient}>
      <ChatBase {...props} />
    </ApolloProvider>
  );
};

export default Chat;
