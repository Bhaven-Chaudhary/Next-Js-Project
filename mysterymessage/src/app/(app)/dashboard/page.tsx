"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User";
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  function handleDeleteMessage(messageId: string) {
    //delete message from UI as soon as user clicks delete button, to implement optimistic UI experience
    setMessages(messages.filter((message) => message._id !== messageId));
  }

  const { data: session } = useSession();

  //creating shadcn form for accept message button
  const form = useForm<z.infer<typeof acceptMessagesSchema>>({
    resolver: zodResolver(acceptMessagesSchema),
  });

  const { register, setValue, watch } = form;

  const acceptMessages = watch("acceptMessages");

  //method to fetch is accepting message status for BE
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await fetch("/api/accept-message");
      const responseData = await response.json();

      if (responseData.success) {
        setValue("acceptMessages", responseData?.isAcceptingMessage);
      } else {
        toast({
          title: "Error",
          description: responseData.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.message || "Unable to fetch is accepting message state",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  //method to fetch all the available messages
  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/get-messages");
      const responseData = await response.json();

      if (responseData.messages) {
        toast({
          title: "Success",
          description: "Fetched latest messages",
        });
        setMessages(responseData.messages || []);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: responseData.message || "Unable to fetch user messages",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Unable to get user messages",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!session || !session?.user) return;

    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchMessages, fetchAcceptMessage]);

  //method to change isAccepting message status in BE
  const handleSwitchChange = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/accept-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ acceptingMessage: !acceptMessages }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        setValue("acceptMessages", !acceptMessages);
        toast({
          title: "Success",
          description: "Accepting state changed successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: responseData.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Accepting state changed successfully",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${session?.user.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      description: "Copied to clipboard",
    });
  };

  // if (!session || !session.user) {
  //   return <div>Please Login</div>;
  // }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages();
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}
