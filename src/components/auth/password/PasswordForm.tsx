import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { toast } from "sonner";

// Base password validation schema
const basePasswordFields = {
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string()
};

// First time login schema
const firstTimeSchema = z.object(basePasswordFields).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Subsequent login schema
const subsequentSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  ...basePasswordFields,
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Define types based on the schemas
type FirstTimeFormValues = z.infer<typeof firstTimeSchema>;
type SubsequentFormValues = z.infer<typeof subsequentSchema>;

interface PasswordFormProps {
  onSubmit: (values: FirstTimeFormValues | SubsequentFormValues) => Promise<void>;
  isSubmitting: boolean;
  isFirstTimeLogin: boolean;
  onCancel: () => void;
}

export const PasswordForm = ({
  onSubmit,
  isSubmitting,
  isFirstTimeLogin,
  onCancel,
}: PasswordFormProps) => {
  const formSchema = isFirstTimeLogin ? firstTimeSchema : subsequentSchema;
  
  const form = useForm<FirstTimeFormValues | SubsequentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isFirstTimeLogin ? {
      newPassword: "",
      confirmPassword: "",
    } : {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  console.log("[PasswordForm] Form state:", {
    isDirty: form.formState.isDirty,
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
    values: form.getValues(),
    timestamp: new Date().toISOString()
  });

  const handleFormSubmit = async (values: FirstTimeFormValues | SubsequentFormValues) => {
    try {
      console.log("[PasswordForm] Submitting form:", {
        isFirstTimeLogin,
        hasCurrentPassword: !isFirstTimeLogin && 'currentPassword' in values,
        values,
        timestamp: new Date().toISOString()
      });

      if (!isFirstTimeLogin && !('currentPassword' in values)) {
        toast.error("Current password is required");
        return;
      }

      if (!values.newPassword || !values.confirmPassword) {
        toast.error("New password and confirmation are required");
        return;
      }

      if (values.newPassword !== values.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      
      await onSubmit(values);
    } catch (error) {
      console.error("[PasswordForm] Error submitting form:", error);
      toast.error(error instanceof Error ? error.message : "Failed to change password");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        {!isFirstTimeLogin && (
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-dashboard-text">Current Password</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="password"
                    className="bg-dashboard-dark border-dashboard-cardBorder text-dashboard-text focus:border-dashboard-accent1" 
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dashboard-text">New Password</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="password"
                  className="bg-dashboard-dark border-dashboard-cardBorder text-dashboard-text focus:border-dashboard-accent1" 
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dashboard-text">Confirm Password</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="password"
                  className="bg-dashboard-dark border-dashboard-cardBorder text-dashboard-text focus:border-dashboard-accent1" 
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          {!isFirstTimeLogin && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="bg-dashboard-dark hover:bg-dashboard-cardHover hover:text-white border-dashboard-cardBorder transition-all duration-200"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] transition-all duration-200 flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            {isSubmitting ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </form>
    </Form>
  );
};