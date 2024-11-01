"use client";
import {
  ClipboardPaste,
  Code,
  Image,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import MediumEditor from "medium-editor";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.css";
import "./new-story.css";
import { createRoot } from "react-dom/client";
import { uploadToS3 } from "@/lib/s3";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import { getStoryById } from "@/actions/get-Stories";
import { Story } from "@prisma/client";

type Props = {
  storyId: string;
  storyContent:string | null |undefined
};

const NewStory = ({ storyId,storyContent }: Props) => {
  const contentEditableRef = useRef<HTMLDivElement|null>(null);
  const [openTools, setOpenTools] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [buttonPosition, setButtonPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  const debouncedHandleSave = useRef(
    debounce(() => {
      handleSave();
    }, 1000)
  ).current;

  const handleSave = async () => {
    const content = contentEditableRef.current?.innerHTML;
    setSaving(true);

    try {
      await fetch("/api/new-story", {
        method: "PATCH",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: JSON.stringify({
          content,
          storyId,
        }),
      });
      console.log("saved");
    } catch (error) {
      console.log("Error in saving");
    }
    setSaving(false);
  };

  const insertImageComp = () => {
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setOpenTools(false);
      const localImageUrl = URL.createObjectURL(file);
      const ImageComponent = (
        <ImageComp
          imageUrl={localImageUrl}
          file={file}
          handleSave={debouncedHandleSave}
        />
      );
      const wrapperDiv = document.createElement("div");
      const root = createRoot(wrapperDiv);
      root.render(ImageComponent);
      contentEditableRef.current?.appendChild(wrapperDiv);
    }
  };

  // const handleButtonPosition = () => {
  //   if (contentEditableRef.current) {
  //     const rect = contentEditableRef.current.getBoundingClientRect();
  //     setButtonPosition({ top: rect.top + window.scrollY - 80, left: -50 });
  //     console.log(rect);
  //   }
  // };
  // useEffect(() => {
  //   const handleInput = () => {
  //     handleButtonPosition();
  //   };
  //   contentEditableRef.current?.addEventListener("input", handleInput);
  // }, []);

  const InsertDivider = () => {
    const DividerComponent = <Divider />;
    setOpenTools(false);
    const wrapperDiv = document.createElement("div");
    const root = createRoot(wrapperDiv);
    root.render(DividerComponent);
    contentEditableRef.current?.appendChild(wrapperDiv);
    handleSave();
  };

  const InsertCodeBlock = () => {
    const CodeBlockComponent = <CodeBlock handleSave={debouncedHandleSave} />;
    setOpenTools(false);
    const wrapperDiv = document.createElement("div");
    const root = createRoot(wrapperDiv);
    root.render(CodeBlockComponent);
    contentEditableRef.current?.appendChild(wrapperDiv);
  };

  const getCaretPosition = () => {
    let x = 0;
    let y = 0;

    const isSupported = typeof window.getSelection !== "undefined";

    if (isSupported) {
      const selection = window.getSelection() as Selection;
      if (selection?.rangeCount > 0) {
        const range = selection.getRangeAt(0).cloneRange();
        const rect = range.getClientRects()[0];
        if (rect) {
          x = rect.left + window.screenX;
          y = rect.top + window.scrollY - 80;
        }
      }
    }

    return { x, y };
  };

  useEffect(() => {
    const handleInput = () => {
      const { x, y } = getCaretPosition();
      setButtonPosition({ top: y, left: -50 });
      debouncedHandleSave();
    };

    contentEditableRef.current?.addEventListener("input", handleInput);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const editor = new MediumEditor(".editable", {
        toolbar: {
          buttons: [
            "bold",
            "italic",
            "underline",
            "anchor",
            "h2",
            "h3",
            "quote",
          ],
        },
        // elementsContainer: document.getElementById('container') as HTMLElement
      });
      return () => {
        editor.destroy();
      }
    }
  }, []);

  // const [story, setStory] = useState<Story>();
  // useEffect(() => {
  //   const fetchStoryById = async () => {
  //     try {
  //       const story = await getStoryById(storyId);
  //       if (story.response) {
  //         setStory(story?.response);
  //         console.log(story.response);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching the story", error);
  //     }
  //   };
  //   fetchStoryById();
  // }, []);

  return (
    <main
      id="container"
      className="max-w-[800px] mx-auto relative font-mono mt-5"
    >
      <p className="absolute -top-[65px] opacity-30">
        {saving ? "saving..." : "saved"}
      </p>
      <div
        id="editable"
        ref={contentEditableRef}
        contentEditable
        suppressContentEditableWarning
        className="outline-none focus:outline-none editable max-w-[800px] prose"
        style={{ whiteSpace: "pre-line" }}
      >
        {storyContent ? (
          <>
            <div dangerouslySetInnerHTML={{ __html: storyContent }}></div>
          </>
        ) : (
          <>
            <h1
              className="font-medium"
              data-h1-placeholder="New Story Title"
            ></h1>
            <p data-p-placeholder="Write your story"></p>
          </>
        )}
      </div>
      <div
        className={`z-10 ${buttonPosition.top === 0 ? "hidden" : ""} `}
        style={{
          position: "absolute",
          top: buttonPosition.top,
          left: buttonPosition.left,
        }}
      >
        <button
          id="tooltip"
          className="border-[1px] border-neutral-500 p-1 rounded-full inline-block"
          onClick={() => setOpenTools(!openTools)}
        >
          <Plus
            className={`duration-300 ease-linear ${
              openTools ? "rotate-90" : ""
            }`}
          />
        </button>
        <div
          id="tool"
          className={`flex items-center space-x-4 absolute top-0 left-14 ${
            openTools ? "visible" : "invisible"
          }`}
        >
          <span
            onClick={insertImageComp}
            className={`border-green-500 border-[1.5px] rounded-full block p-[6px] cursor-pointer bg-white ${
              openTools ? "scale-100 visible" : "scale-0 invisible"
            } ease-linear duration-100 `}
          >
            <Image size={20} className="opacity-60 text-green-800" />
            <input
              type="file"
              name=""
              id=""
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileInputChange}
            />
          </span>
          <span
            onClick={InsertDivider}
            className={`border-green-500 border-[1.5px] rounded-full block p-[6px] cursor-pointer bg-white ${
              openTools ? "scale-100 visible" : "scale-0 invisible"
            } ease-linear duration-100  delay-75`}
          >
            <MoreHorizontal size={20} className="opacity-60 text-green-800" />
          </span>
          <span
            onClick={InsertCodeBlock}
            className={`border-green-500 border-[1.5px] rounded-full block p-[6px] cursor-pointer bg-white ${
              openTools ? "scale-100 visible" : "scale-0 invisible"
            } ease-linear duration-100 delay-100`}
          >
            <Code size={20} className="opacity-60 text-green-800" />
          </span>
        </div>
      </div>
    </main>
  );
};

export default NewStory;

const ImageComp = ({
  imageUrl,
  file,
  handleSave,
}: {
  imageUrl: string;
  file: File;
  handleSave: () => void;
}) => {
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(imageUrl);
  const updateImageUrl = async () => {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const SecureImageUrl = await uploadToS3(file, fileName);
      setCurrentImageUrl(SecureImageUrl);
    } catch (error) {
      console.error("Error uploading the image:", error);
    }
  };
  useEffect(() => {
    updateImageUrl().then(() => {
      handleSave();
    });
  }, [imageUrl]);
  return (
    <div className="py-3">
      <div>
        <img
          src={currentImageUrl}
          alt="Image"
          className="max-w-full min-w-[800px] h-[450px] object-fill"
        />
        <div className="text-center text-sm max-w-md mx-auto ">
          <p data-p-placeholder="Type caption for your image"></p>
        </div>
      </div>
      <p data-p-placeholder="..."></p>
    </div>
  );
};

const Divider = () => {
  return (
    <div className="py-3 w-full">
      <div
        className="text-center flex items-center justify-center "
        contentEditable={false}
      >
        <MoreHorizontal size={32} />
      </div>
      <p data-p-placeholder="Write your text ..."></p>
    </div>
  );
};

const CodeBlock = ({handleSave}:{handleSave:()=>void}) => {
  const [language, setLanguage] = useState<string>("javascript");
  const [code, setCode] = useState<string>("");
  const [highlightedCode, setHighlightedCode] = useState<string>("");

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value);
  };
  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    setCode(event.target.value || "");
  };

  const handlePaste = async () => {
    try {
      const clipboardData = await navigator.clipboard.readText();
      setCode((prev) => prev + clipboardData);
    } catch (error) {
      console.log("error");
    }
  };
  useEffect(() => {
    const highlighted = hljs.highlight(code, {
      language,
      ignoreIllegals: true,
    }).value;
    setHighlightedCode(highlighted);
    handleSave();
  }, [language, code, highlightedCode]);
  return (
    <div className="w-full">
      <div className="prose w-full relative bg-gray-50 rounded-sm p-5 focus:outline-none">
        <div>
          <select
            contentEditable={false}
            className="bg-gray-100 border-dotted border-[2px] rounded-sm p-1 text-stone-700"
            defaultValue={language}
            onChange={handleLanguageChange}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>
        <textarea
          contentEditable={true}
          className="w-full focus:outline-none p-2"
          onChange={handleCodeChange}
        />
        <button
          onClick={handlePaste}
          className="absolute top-2 right-2 cursor-pointer"
        >
          <ClipboardPaste />
        </button>
        <div
          className={`language-${language} text-base block overflow-auto p-3 focus:outline-none`}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
          style={{ whiteSpace: "pre-wrap" }}
        ></div>
      </div>
      <p data-p-placeholder="Write your text ..."></p>
    </div>
  );
};
