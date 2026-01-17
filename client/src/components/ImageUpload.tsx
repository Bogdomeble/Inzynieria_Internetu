import { useState } from 'react';
import { uploadsApi } from '../lib/api';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | undefined>(value);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // walidacja
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        setIsUploading(true);

        //podgląd lokalny
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        try {
            const url = await uploadsApi.uploadImage(file);
            onChange(url);
            setPreview(url);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image');
            setPreview(undefined);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        onChange('');
        setPreview(undefined);
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-text-muted">
                Featured Image
            </label>

            {preview ? (
                <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border border-secondary">
                    <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition-colors shadow-sm"
                        title="Remove image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
            ) : (
                <div className="flex w-full items-center justify-center">
                    <label className="flex h-32 w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-secondary bg-primary/50 hover:bg-secondary/50 transition-colors">
                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                            {isUploading ? (
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-accent"></div>
                            ) : (
                                <>
                                    <svg className="mb-3 h-8 w-8 text-text-muted" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    <p className="mb-2 text-sm text-text-muted"><span className="font-semibold">Click to upload</span></p>
                                    <p className="text-xs text-text-muted">SVG, PNG, JPG or WEBP</p>
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/*"
                            disabled={isUploading}
                        />
                    </label>
                </div>
            )}
        </div>
    );
}