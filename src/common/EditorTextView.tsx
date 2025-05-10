import { Text, Button } from "@chakra-ui/react";
import { useState } from "react";

const EditorTextView = ({ message }: { message: string }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleMessage = () => {
    setExpanded((prev) => !prev);
  };

  // Function to safely truncate HTML content
  const truncateHTML = (html: string, maxLength: number) => {
    if (html.length <= maxLength) return html;
    return `${html.substring(0, maxLength)}...`;
  };

  // Check if the message is longer than 100 characters
  const isExpandable = message.length > 100;

  return (
    <div className="min-w-[300px] max-w-[500px] overflow-hidden">
      {isExpandable ? (
        // Expandable behavior
        expanded ? (
          <div>
            {/* Render full HTML content */}
            <Text
              dangerouslySetInnerHTML={{ __html: message }}
              whiteSpace="normal"
              wordBreak="break-word"
            />
            {/* "Show less" button */}
            <Button
              onClick={toggleMessage}
              variant="plain"
              color="blue.500"
              fontSize="sm"
              p={1}
              mt={1}
            >
              Show less
            </Button>
          </div>
        ) : (
          <div onClick={toggleMessage} style={{ cursor: "pointer" }}>
            {/* Render truncated HTML content */}
            <Text
              display="inline"
              dangerouslySetInnerHTML={{
                __html: truncateHTML(message, 350),
              }}
              whiteSpace="normal"
              wordBreak="break-word"
            />
            {/* "Show more" text */}
            <Text as="span" color="blue.500" ml={1}>
              ... Show more
            </Text>
          </div>
        )
      ) : (
        // Non-expandable behavior
        <Text
          dangerouslySetInnerHTML={{ __html: message }}
          whiteSpace="normal"
          wordBreak="break-word"
        />
      )}
    </div>
  );
};

export default EditorTextView;
