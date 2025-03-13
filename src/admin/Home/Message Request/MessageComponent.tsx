import { Text } from "@chakra-ui/react";
import { useState } from "react";

const MessageContent = ({ message }: { message: string }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleMessage = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="min-w-[250px] max-w-[300px] overflow-hidden">
      {expanded ? (
        <div>
          <Text>{message}</Text>
          <button
            onClick={toggleMessage}
            style={{
              background: "none",
              border: "none",
              color: "#3182ce",
              cursor: "pointer",
              padding: "2px 5px",
              fontSize: "12px",
            }}
          >
            Show less
          </button>
        </div>
      ) : (
        <div onClick={toggleMessage} style={{ cursor: "pointer" }}>
          <Text display="inline">
            {message.substring(0, 100)}
            {message.length > 100 && (
              <span style={{ color: "#3182ce", marginLeft: "5px" }}>
                ... Show more
              </span>
            )}
          </Text>
        </div>
      )}
    </div>
  );
};

export default MessageContent;
