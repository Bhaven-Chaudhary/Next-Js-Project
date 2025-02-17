"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const params = useParams();
  const [isAcceptingMessage, setIsAcceptingMessage] = useState(false);
  const { toast } = useToast();

  //   on page load check is use is accepting messages
  useEffect(() => {
    const fetchMessageAcceptanceStatus = async () => {
      try {
        const response = await fetch("/api/accept-message");
        const responseData = await response.json();

        if (responseData.success) {
          setIsAcceptingMessage(true);
        } else {
          setIsAcceptingMessage(false);
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
          description:
            error.message || "Unable to fetch is accepting message state",
        });
      }
    };

    fetchMessageAcceptanceStatus();
  }, [toast]);

  const formSchema = z.object({
    message: z
      .string()
      .min(10, { message: "Message must be 10 or more characters long" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isAcceptingMessage) {
      try {
        const response = await fetch("/api/send-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: params.username,
            content: values.message,
          }),
        });

        const responseData = await response.json();

        if (responseData.success) {
          toast({
            title: "Success",
            description: "Message send to user successfully",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              responseData.message || "Unable to send message to user",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error?.message || "Unable to send message to user",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User is not accepting message",
      });
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen flex-col">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Public Profile Link
      </h1>
      <div className="w-full max-w-6xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Send Anonymous message to {params.username}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please enter your anonymous message"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Send It</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
