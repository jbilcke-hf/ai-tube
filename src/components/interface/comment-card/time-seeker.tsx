import React from "react"

interface CommentWithTimeSeeksProps {
  onSeek: (timeInSec: number) => void;
  children: string;
  className?: string;
  linkClassName?: string;
}

export const CommentWithTimeSeeks: React.FC<CommentWithTimeSeeksProps> = ({ onSeek, children, className, linkClassName }) => {
  // This function converts a time string like "HH:MM:SS", "MM:SS" or "SS" to seconds.
  const convertTimeToSeconds = (timeString: string): number => {
    const units = timeString.split(":").map(unit => parseInt(unit, 10));
    const seconds = units.reverse().reduce((acc, unit, index) => acc + unit * Math.pow(60, index), 0);
    return seconds;
  };

  // This function parses the text and replaces time seeks with clickable spans.
  const renderWithTimeSeek = (text: string) => {
    const timeSeekPattern = /\b(\d{1,2}:)?\d{1,2}:\d{2}\b/g;
    const nodes = [];
    let lastIndex = 0;

    text.replace(timeSeekPattern, (match, ...args) => {
      const index = args[args.length - 2]; // The second to last argument is the index of the match
      nodes.push(
        <React.Fragment key={lastIndex}>
          {text.slice(lastIndex, index)}{/* Text before the match */}
          <span
            className={linkClassName}
            onClick={() => onSeek(convertTimeToSeconds(match))}
          >
            {match}
          </span>
        </React.Fragment>
      );
      lastIndex = index + match.length; // Update lastIndex to end of the current match
      return match; // return value is unused but needed for `replace` to work
    });

    // Append the remaining text after the last match (if any)
    if (lastIndex < text.length) {
      nodes.push(<React.Fragment key={lastIndex}>{text.slice(lastIndex)}</React.Fragment>);
    }

    return nodes;
  };

  return <p className={className}>{renderWithTimeSeek(children)}</p>;
};
