import React from "react";
import { Stack, Input, Textarea, Button, Flex } from "@chakra-ui/react";
import { textInputsState } from "../NewPostForm";

type TextInputsProps = {
  inputsValues: textInputsState;
  changeInuptsValues: any;
};

const TextInputs: React.FC<TextInputsProps> = ({ inputsValues, changeInuptsValues }) => {
  return (
    <Stack spacing={3} width="100%">
      <Input
        name="title"
        value={inputsValues.title}
        onChange={(e) => changeInuptsValues(e)}
        placeholder="Title"
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black"
        }}
        fontSize="10pt"
        borderRadius={4}
      />
      <Textarea
        resize="none"
        name="description"
        value={inputsValues.description}
        onChange={(e) => changeInuptsValues(e)}
        placeholder="Description (optional)"
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black"
        }}
        height="100px"
      />
      <Flex justify="flex-end">
        <Button height="34px" padding="0px 30px" onClick={() => {}}>
          Post
        </Button>
      </Flex>
    </Stack>
  );
};

export default TextInputs;
