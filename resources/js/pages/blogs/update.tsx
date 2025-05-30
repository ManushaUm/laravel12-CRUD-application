import Tiptap from '@/components/tiptap';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

type blogType = {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    category: string;
    image: string;
};
type Props = {
    blog: blogType;
};
const Update = ({ blog }: Props) => {
    const [previewImage, setPreviewImage] = useState<string | undefined>();
    console.log({ blog });
    const { data, setData, put, post, processing, errors, reset } = useForm({
        title: blog.title || '',
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        author: blog.author || '',
        category: blog.category || '',
        tags: '',
        image: blog.image || (null as File | null),
    });
    const categories = ['Technology', 'Design', 'Development', 'Web3', 'AI', 'UI/UX', 'Mobile', 'Business'];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData(name as any, value);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setData('image', selectedFile);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreviewImage(event.target?.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Using Inertia's post method for form submission
        put(route('blogs.update', blog.id), {
            onSuccess: () => {
                toast.success('Blog post updated successfully!');
                //clear the input fields after successful submission
                reset();
                setPreviewImage('');
            },
            onError: () => {
                toast.error('Failed to update blog post. Please try again.');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Create Blog Post" />
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4" encType="multipart/form-data">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                placeholder="Blog title"
                                value={data.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <Label htmlFor="excerpt">Highlighted Content</Label>
                        <Textarea
                            id="excerpt"
                            name="excerpt"
                            value={data.excerpt}
                            required
                            autoFocus
                            tabIndex={2}
                            onChange={handleInputChange}
                            disabled={processing}
                            placeholder="Short content that need to display in the home page"
                        />
                        <Label htmlFor="content">Content</Label>
                        <Tiptap content={data.content} onChange={(html: string) => setData('content', html)} />

                        <div>
                            <label
                                htmlFor="category"
                                className="text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                            >
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={data.category}
                                onChange={handleInputChange}
                                className="focus:ring-opacity-30 w-full rounded-lg border px-4 py-3 focus:ring-2"
                                required
                            >
                                <option value="" disabled>
                                    Select a category
                                </option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>

                            <Label htmlFor="excerpt">Image</Label>
                            <div className="flex w-full items-center justify-center">
                                <label
                                    htmlFor="image-upload"
                                    className="hover:bg-gray-750 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed"
                                >
                                    {previewImage ? (
                                        <div className="h-full w-full overflow-hidden rounded-lg">
                                            <img src={previewImage} alt="Preview" className="h-full w-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg
                                                className="mb-3 h-10 w-10 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                ></path>
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-400">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                                        </div>
                                    )}
                                    <input
                                        id="image-upload"
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                            {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}

                            <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Update
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
};

export default Update;
