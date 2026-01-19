"use client";

import { useStreamChat } from "@/hooks/useStreamChat";
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

export default function MessagesPage() {
  const { client, loading, error } = useStreamChat();

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-200">
          Failed to connect to chat
        </h3>
        <p className="text-sm text-red-600 dark:text-red-300">{error.message}</p>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Make sure the Stream Chat edge function is deployed in Supabase.
        </p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400">
          Please sign in to access messages.
        </p>
      </div>
    );
  }

  const filters = { members: { $in: [client.userID!] } };
  const sort = { last_message_at: -1 as const };
  const options = { state: true, watch: true, presence: true };

  return (
    <div className="h-[calc(100vh-200px)]">
      <Chat client={client} theme="str-chat__theme-light">
        <div className="flex h-full gap-4">
          {/* Channel List */}
          <div className="w-80 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-gray-200 p-4 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Messages
              </h2>
            </div>
            <ChannelList filters={filters} sort={sort} options={options} />
          </div>

          {/* Active Channel */}
          <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <Channel>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </div>
        </div>
      </Chat>
    </div>
  );
}
