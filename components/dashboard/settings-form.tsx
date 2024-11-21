"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/editorStore";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "zustand";

const formSchema = z.object({
  fontSize: z.string(),
  tabSize: z.string(),
});

export type FormSchema = z.infer<typeof formSchema>;

export function SettingsForm() {
  const { toast } = useToast();

  const { settings, updateSettings } = useStore(
    useEditorStore,
    useShallow((state) => ({
      updateSettings: state.updateSettings,
      settings: state.settings,
    })),
  );
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: settings,
  });

  function onSubmit(data: FormSchema) {
    updateSettings({ ...data });
    toast({
      title: "Settings updated!",
      variant: "success",
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="fontSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font Size</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a font size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}px
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tabSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tab Size</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tab size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="2">2 spaces</SelectItem>
                  <SelectItem value="4">4 spaces</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="mt-3">
          <DialogPrimitive.Close asChild>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Save
            </Button>
          </DialogPrimitive.Close>
        </DialogFooter>
      </form>
    </Form>
  );
}
