interface LinkifiedTextProps {
    text: string;
}

export function LinkifiedText({ text }: LinkifiedTextProps) {
    if (!text) return null;

    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const parts = text.split(urlRegex);

    return (
        <span>
            {parts.map((part, i) => {
                if (part.match(urlRegex)) {
                    return (
                        <a
                            key={i}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent font-medium hover:text-accent/80 hover:underline break-words transition-colors"
                        >
                            {part}
                        </a>
                    );
                }
                //zwykły tekst
                return part;
            })}
        </span>
    );
}