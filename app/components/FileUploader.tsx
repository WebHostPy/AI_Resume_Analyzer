import {useState, useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { formatSize } from '../lib/utils'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [localFile, setLocalFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        setLocalFile(file);
        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf']},
        maxSize: maxFileSize,
    })

    return (
        <div className="w-full">
            <div {...getRootProps()} className="w-full outline-none">
                <input {...getInputProps()} />

                {localFile ? (
                    // SELECTED STATE
                    <div 
                        className="flex flex-col items-center justify-center p-8 border-2 border-blue-400 rounded-2xl bg-blue-50 relative overflow-hidden group transition-all" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Remove Button */}
                        <button 
                            type="button"
                            className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm cursor-pointer hover:bg-red-50 border border-gray-100 transition-colors z-10" 
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setLocalFile(null);
                                onFileSelect?.(null);
                            }}
                        >
                            <svg className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        {/* Visual File Block */}
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-blue-200 flex items-center justify-center mb-4 relative">
                            {/* Checkmark Badge */}
                            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-sm border-2 border-white">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 2C4.895 2 4 2.895 4 4v16c0 1.105.895 2 2 2h12c1.105 0 2-.895 2-2V8.828a2 2 0 00-.586-1.414l-4.828-4.828A2 2 0 0013.172 2H6zm7 1.5l4.5 4.5H13V3.5zM7 11h10v2H7v-2zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
                            </svg>
                        </div>

                        <p className="text-blue-900 font-bold max-w-[250px] truncate text-center break-words px-4 text-[15px]">
                            {localFile.name}
                        </p>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-2 border border-blue-200 bg-white px-3 py-1 rounded-full shadow-inner">
                            {formatSize(localFile.size)} • SECURE UPLOAD
                        </p>
                    </div>
                ): (
                    // EMPTY / EMPTY DROP STATE
                    <div 
                        className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer w-full text-center group ${
                            isDragActive 
                            ? 'border-blue-500 bg-gradient-to-br from-blue-100 to-blue-50 scale-[1.02]' 
                            : 'border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 hover:bg-blue-50 hover:border-blue-300 hover:shadow-inner'
                        }`}
                    >
                        {/* Interactive PDF Icon */}
                        <div className={`w-20 h-20 bg-white rounded-[1.5rem] shadow-sm border border-blue-100 flex items-center justify-center mb-5 transition-transform duration-500 ${isDragActive ? 'scale-110 -rotate-6' : 'group-hover:-translate-y-2 group-hover:shadow-md group-hover:border-blue-300'}`}>
                            <svg className={`w-10 h-10 ${isDragActive ? 'text-blue-600' : 'text-blue-400 group-hover:text-blue-500'} transition-colors duration-300`} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 2C4.895 2 4 2.895 4 4v16c0 1.105.895 2 2 2h12c1.105 0 2-.895 2-2V8.828a2 2 0 00-.586-1.414l-4.828-4.828A2 2 0 0013.172 2H6zm7 1.5l4.5 4.5H13V3.5zM7 11h10v2H7v-2zm0 4h10v2H7v-2zm0 4h7v2H7v-2z"/>
                            </svg>
                        </div>
                        
                        {/* Centered Typography */}
                        <p className="text-gray-600 font-medium mb-2 text-[15px]">
                            <span className="text-blue-600 font-bold bg-blue-100/50 px-2 py-0.5 rounded-md">Click to upload</span> or drag and drop your file
                        </p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                            PDF Document (Max {formatSize(maxFileSize)})
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
export default FileUploader
