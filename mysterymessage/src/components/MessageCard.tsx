"use client";
import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Message } from "@/model/User";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { ApiResponse } from "@/types/ApiResponseTypes";

//creating type for message prop
type messageCardProp = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export default function MessageCard({
  message,
  onMessageDelete,
}: messageCardProp) {
  const { toast } = useToast();
  // Function to delete message using message id
  async function handelDeleteConfirm() {
    const response = await fetch(`/api/delete-message/${message._id}`, {
      method: "DELETE",
    });

    const responseData: ApiResponse = await response.json();

    if (responseData.success) {
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });

      onMessageDelete(message._id);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to delete message",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to permanently delete this message
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handelDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
    </Card>
  );
}
