import React, { useRef, useMemo, useCallback } from "react";
import JoditEditor from "jodit-react";

const RichTextEditor = React.memo(({ initialValue, getValue, isUpdate }) => {
  const editor = useRef(null);

  const handleEditorChange = useCallback(
    async (newContent) => {
      // This callback is asynchronous
      console.log("------------------------");
      console.log("I am inside the callback of Text Editor");

      // Assuming getValue performs an asynchronous operation, like an HTTP request
      try {
        await getValue(newContent); // Wait for the promise to resolve
      } catch (error) {
        console.error("Error updating value:", error);
      }
    },
    [getValue]
  );

  const config = useMemo(
    () => ({
      buttons: [
        "bold",
        "fontsize",
        "italic",
        "foreColor",
        "underline",
        "fullsize",
      ],
      readonly: false,
      addNewLineOnDBLClick: false,
      imageDefaultWidth: 100,
      removeButtons: [
        "source",
        "outdent",
        "indent",
        "video",
        "print",
        "table",
        "superscript",
        "subscript",
        "file",
        "cut",
        "selectall",
        "image",
        "url",
        "link",
      ],
      disablePlugins: ["paste", "stat"],
      textIcons: false,
    }),
    []
  );

  if (isUpdate) {
    return (
      <JoditEditor
        ref={editor}
        value={initialValue}
        config={config}
        onBlur={handleEditorChange}
        // onChange={handleEditorChange}
      />
    );
  }

  return (
    <JoditEditor
      ref={editor}
      value={""}
      config={config}
      onBlur={(newContent) => getValue(newContent)}
      onChange={(newContent) => getValue(newContent)}
    />
  );
});

export default RichTextEditor;
