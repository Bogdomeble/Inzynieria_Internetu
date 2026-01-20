import { useState, useCallback } from 'react';
import { uploadsApi } from '../lib/api';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | undefined>(value);
    const [isDragging, setIsDragging] = useState(false);

    const processFile = async (file: File) => {
        if (!file) return;

        // Walidacja typu
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Walidacja rozmiaru (np. max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File is too large (max 5MB)');
            return;
        }

        setIsUploading(true);
        // Podgląd lokalny (natychmiastowy)
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        try {
            const url = await uploadsApi.uploadImage(file);
            onChange(url);
            setPreview(url); // Podmień blob na URL z serwera
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image. Make sure you are logged in.');
            setPreview(undefined);
            onChange('');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    // Obsługa Drag & Drop
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    }, []);

    const handleRemove = () => {
        onChange('');
        setPreview(undefined);
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-bold text-muted-foreground ml-1">
                Featured Image
            </label>

            {preview ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-secondary group">
                    <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button
                            type="button"
                            onClick={handleRemove}
                            className="rounded-full bg-red-500/90 px-4 py-2 text-sm font-bold text-white hover:bg-red-600 transition-colors shadow-lg backdrop-blur-sm"
                        >
                            Remove Image
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex w-full items-center justify-center">
                    <label
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                            flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200
                            ${isDragging 
                                ? 'border-accent bg-accent/10 scale-[1.01]' 
                                : 'border-secondary bg-secondary/30 hover:bg-secondary/50 hover:border-accent/50'
                            }
                        `}
                    >
                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                            {isUploading ? (
                                <div className="flex flex-col items-center gap-3">
                                     <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-accent"></div>
                                     <p className="text-sm text-muted-foreground">Uploading...</p>
                                </div>
                            ) : (
                                <>
                                    <svg className={`mb-4 h-10 w-10 ${isDragging ? 'text-accent' : 'text-muted-foreground'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    <p className="mb-2 text-sm text-text-muted">
                                        <span className="font-bold text-foreground">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-muted-foreground">SVG, PNG, JPG or WEBP (MAX. 5MB)</p>
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