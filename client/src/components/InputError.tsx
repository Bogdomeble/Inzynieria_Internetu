interface InputErrorProps {
    message?: string;
}

export function InputError({ message }: InputErrorProps) {
    if (!message) return null;
    return (
        <span className="mt-1 ml-1 text-xs font-medium text-red-400 animate-in fade-in slide-in-from-top-1">
            {message}
        </span>
    );
}
