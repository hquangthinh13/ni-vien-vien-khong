"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Checkbox } from "@/shared/ui/checkbox";

import { ComponentTypeEnum } from "@/types/form-components";
import { customKey } from "@/shared/lib/registration-schema";

export default function CustomFields({ form, customizedComponents }: any) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Thông tin bổ sung</h3>

      {customizedComponents.map((c: any) => {
        const name = customKey(c.id);

        // NOTE: multiple choice cần data options. populate của bạn có:
        // registrationForm.customizedComponents.multipleChoiceDetails.options
        // nhưng type chưa expose. Ở đây mình render theo best-effort.

        if (c.type === ComponentTypeEnum.Bool) {
          return (
            <FormField
              key={c.id}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={(v) => field.onChange(!!v)}
                    />
                  </FormControl>
                  <FormLabel className="m-0">{c.label}</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        }

        if (c.type === ComponentTypeEnum.LongText) {
          return (
            <FormField
              key={c.id}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{c.label}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        }

        // date/datetime/number/short text -> Input
        const inputType =
          c.type === ComponentTypeEnum.Number
            ? "number"
            : c.type === ComponentTypeEnum.Date
              ? "date"
              : c.type === ComponentTypeEnum.DateTime
                ? "datetime-local"
                : "text";

        return (
          <FormField
            key={c.id}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{c.label}</FormLabel>
                <FormControl>
                  <Input type={inputType} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      })}
    </div>
  );
}
