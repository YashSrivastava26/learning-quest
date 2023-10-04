"use client";
import { FC } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useForm } from "react-hook-form";
import { createCourseSchema, createCourseType } from "@/validators/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Plus, Trash } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import SubscriptionCredits from "./SubscriptionCredits";

interface CreateCourseFormProps {
  isSubscribed: boolean;
}

const CreateCourseForm: FC<CreateCourseFormProps> = ({ isSubscribed }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: createCourse, isLoading } = useMutation({
    mutationFn: async ({ title, units }: createCourseType) => {
      const res = await axios.post("/api/course/create-chapter", {
        title,
        units,
      });
      return res.data;
    },
  });
  const form = useForm<createCourseType>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      units: ["", "", ""],
    },
  });

  const onSubmit = (data: createCourseType) => {
    if (data.units.some((unit) => unit === "")) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all the units",
      });
    }
    createCourse(data, {
      onSuccess: ({ course_id }) => {
        toast({
          title: "Success",
          description: "Course created successfully",
        });
        router.push(`/create/${course_id}`);
      },
      onError: (error) => {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with request.",
        });
      },
    });
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full mt-4 !gap-y-2 flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col justify-center items-start w-full sm:items-center sm:flex-row">
                  <FormLabel className="flex-[1] items-center text-xl">
                    Title
                  </FormLabel>
                  <FormControl className="flex-[6]">
                    <Input
                      placeholder="Enter the title of your course"
                      {...field}
                      className="sm:!mt-0"
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <AnimatePresence>
            {form.watch("units").map((_, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FormField
                    control={form.control}
                    name={`units.${index}`}
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
                          <FormLabel className="flex-[1] items-center text-xl">
                            Unit {index + 1}
                          </FormLabel>
                          <FormControl className="flex-[6]">
                            <Input
                              placeholder="Enter the sub-topic of your course"
                              {...field}
                              className="sm:!mt-0"
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div className="flex items-center justify-center mt-4">
            <Separator className="flex-[1]" />
            <div className="mx-4">
              <Button
                type="button"
                variant="secondary"
                className="font-semibold"
                onClick={() => {
                  form.setValue("units", [...form.watch("units"), ""]);
                }}
              >
                Add Unit
                <Plus className="w-4 h-4 ml-2 text-green-500" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="font-semibold ml-2"
                onClick={() => {
                  form.setValue("units", form.watch("units").slice(0, -1));
                }}
              >
                Remove Unit
                <Trash className="w-4 h-4 ml-2 text-red-500" />
              </Button>
            </div>
            <Separator className="flex-[1]" />
          </div>
          <Button disabled={isLoading} className="mt-6 w-full" size="lg">
            Let&apos;s Go!!!
          </Button>
        </form>
      </Form>
      {/* {!isSubscribed && <SubscriptionCredits />} */}
      <SubscriptionCredits isSubscribed={isSubscribed} />
    </div>
  );
};

export default CreateCourseForm;
