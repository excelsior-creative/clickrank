import React from "react";
import { DefaultNodeTypes, DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import {
  JSXConvertersFunction,
  RichText as PayloadRichText,
} from "@payloadcms/richtext-lexical/react";

import { cn } from "@/lib/utils";

const converters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
});

type Props = {
  data: DefaultTypedEditorState;
  enableGutter?: boolean;
  enableProse?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const RichText = ({
  className,
  data,
  enableGutter = false,
  enableProse = true,
  ...rest
}: Props) => {
  return (
    <PayloadRichText
      converters={converters}
      data={data}
      className={cn(
        {
          container: enableGutter,
          "max-w-none": !enableGutter,
          "prose prose-lg dark:prose-invert": enableProse,
        },
        className
      )}
      {...rest}
    />
  );
};
