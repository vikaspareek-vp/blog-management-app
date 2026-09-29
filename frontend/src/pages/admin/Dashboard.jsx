import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../api/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const editFormRef = useRef(null)
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [contentType, setContentType] = useState("image");
    const [content, setContent] = useState(null);
    const [contentUrl, setContentUrl] = useState("");
    const [blogs, setBlogs] = useState([]);
    const [editingBlog, setEditingBlog] = useState(null);
    const [blogComments, setBlogComments] = useState({});
    const [openComments, setOpenComments] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/admin/login");
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        try {
            const formData = new FormData();

            formData.append("title", title);
            formData.append("description", description);
            formData.append("contentType", contentType);

            if (contentType === "url") {
                formData.append("contentUrl", contentUrl);
            } else {
                formData.append("content", content);
            }
            if (contentType !== "url") {
                if (!content) {
                    alert("Please select a file");
                    return;
                }

                if (contentType === "gif" && content.type !== "image/gif") {
                    alert("Please select a GIF file");
                    return;
                }

                if (contentType === "image" && !content.type.startsWith("image/")) {
                    alert("Please select an image file");
                    return;
                }

                if (contentType === "video" && !content.type.startsWith("video/")) {
                    alert("Please select a video file");
                    return;
                }
            }
            const response = await axios.post(
                `${API_URL}/api/blogs`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setBlogs((prev) => [...prev, response.data.blog]);

            alert("Blog created successfully");

            setTitle("");
            setDescription("");
            setContent(null);
            setContentUrl("");

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to create blog"
            );
        }
    };
    // handle update
    const handleUpdate = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        try {
            setIsUpdating(true);
            setUploadProgress(0);

            const formData = new FormData();

            formData.append("title", editingBlog.title);
            formData.append("description", editingBlog.description);
            formData.append("contentType", editingBlog.contentType);
            formData.append("contentUrl", editingBlog.contentUrl);

            if (content) {
                formData.append("content", content);
            }

            const response = await axios.put(
                `${API_URL}/api/blogs/${editingBlog._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },

                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round(
                            (progressEvent.loaded * 100) /
                            progressEvent.total
                        );

                        setUploadProgress(percent);
                    }
                }
            );

            setBlogs((prev) =>
                prev.map((blog) =>
                    blog._id === editingBlog._id
                        ? response.data.blog
                        : blog
                )
            );

            setEditingBlog(null);
            setContent(null);

            alert("Blog updated successfully");

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update blog"
            );
        } finally {
            setIsUpdating(false);
            setUploadProgress(0);
        }
    };
    // fetch comment
    const fetchComments = async (blogId) => {
        try {
            const response = await axios.get(
                `${API_URL}/api/blogs/${blogId}/comments`
            );

            setBlogComments((prev) => ({
                ...prev,
                [blogId]: response.data
            }));

            setOpenComments((prev) => ({
                ...prev,
                [blogId]: true
            }));
        } catch (error) {
            console.log(error);
        }
    };
    const handleDeleteComment = async (commentId, blogId) => {
        const token = localStorage.getItem("token");

        try {
            await axios.delete(
                `${API_URL}/api/blogs/comments/${commentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Remove deleted comment from dashboard
            setBlogComments((prev) => ({
                ...prev,
                [blogId]: prev[blogId].filter(
                    (comment) => comment._id !== commentId
                )
            }));

            alert("Comment deleted successfully");
        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete comment"
            );
        }
    };
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/api/blogs`
                );

                setBlogs(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchBlogs();
    }, []);
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Admin Dashboard
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Manage your blogs and comments
                    </p>
                </div>


                {/* Create Blog */}

                {!editingBlog && (
                    <section className="max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                Create Blog
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Create a new blog post
                            </p>
                        </div>


                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* Title */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter blog title"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>


                            {/* Description */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter blog description"
                                    rows="5"
                                    required
                                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>


                            {/* Content Type */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Content Type
                                </label>

                                <select
                                    value={contentType}
                                    onChange={(e) => {
                                        setContentType(e.target.value);
                                        setContent(null);
                                        setContentUrl("");
                                    }}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="image">Image</option>
                                    <option value="gif">GIF</option>
                                    <option value="video">Video</option>
                                    <option value="url">URL</option>
                                </select>
                            </div>


                            {/* File */}
                            {contentType !== "url" && (
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        {contentType === "image" && "Select Image"}
                                        {contentType === "gif" && "Select GIF"}
                                        {contentType === "video" && "Select Video"}
                                    </label>

                                    <input
                                        type="file"
                                        accept={
                                            contentType === "video"
                                                ? "video/*"
                                                : contentType === "gif"
                                                    ? "image/gif"
                                                    : "image/*"
                                        }
                                        onChange={(e) =>
                                            setContent(e.target.files[0])
                                        }
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm"
                                    />
                                </div>
                            )}


                            {/* URL */}
                            {contentType === "url" && (
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Content URL
                                    </label>

                                    <input
                                        type="url"
                                        value={contentUrl}
                                        onChange={(e) =>
                                            setContentUrl(e.target.value)
                                        }
                                        placeholder="https://example.com"
                                        required
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            )}


                            <button
                                type="submit"
                                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                            >
                                Create Blog
                            </button>

                        </form>

                    </section>
                )}

                {/* Edit Blog */}
                {editingBlog && (
                    <section
                        ref={editFormRef}
                        className="mt-8 rounded-2xl border border-blue-200 bg-white p-6 shadow-sm"
                    >
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                Edit Blog
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Update the title, description, or content
                            </p>
                        </div>

                        <form
                            onSubmit={handleUpdate}
                            className="space-y-5"
                        >
                            {/* Title */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    value={editingBlog.title}
                                    onChange={(e) =>
                                        setEditingBlog({
                                            ...editingBlog,
                                            title: e.target.value
                                        })
                                    }
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Description
                                </label>

                                <textarea
                                    value={editingBlog.description}
                                    onChange={(e) =>
                                        setEditingBlog({
                                            ...editingBlog,
                                            description: e.target.value
                                        })
                                    }
                                    required
                                    rows="4"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            {/* Content */}
                            {editingBlog.contentType === "url" ? (
                                /* URL */
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        URL
                                    </label>

                                    <input
                                        type="url"
                                        value={editingBlog.contentUrl}
                                        onChange={(e) =>
                                            setEditingBlog({
                                                ...editingBlog,
                                                contentUrl: e.target.value
                                            })
                                        }
                                        required
                                        placeholder="https://example.com"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                    <p className="mt-2 text-sm text-gray-500">
                                        Enter the new external URL.
                                    </p>
                                </div>
                            ) : (
                                /* Image / GIF / Video */
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Replace {editingBlog.contentType}
                                    </label>

                                    <input
                                        type="file"
                                        accept={
                                            editingBlog.contentType === "video"
                                                ? "video/*"
                                                : editingBlog.contentType === "gif"
                                                    ? "image/gif"
                                                    : "image/*"
                                        }
                                        onChange={(e) =>
                                            setContent(e.target.files[0])
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3"
                                    />

                                    <p className="mt-2 text-sm text-gray-500">
                                        Leave empty to keep the current{" "}
                                        {editingBlog.contentType}.
                                    </p>
                                </div>
                            )}

                            {/* Upload Progress */}
                            {isUpdating && (
                                <div className="mt-3">
                                    <div className="mb-1 flex justify-between text-sm text-gray-600">
                                        <span>Uploading content...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>

                                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                                        <div
                                            className="h-full rounded-full bg-blue-600 transition-all"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isUpdating ? "Uploading..." : "Update Blog"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingBlog(null);
                                        setContent(null);
                                    }}
                                    className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </section>
                )}


                {/* Existing Blogs */}
                <section className="mt-8">

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Existing Blogs
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Manage your published blogs
                        </p>
                    </div>


                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                        {blogs.map((blog) => (

                            <article
                                key={blog._id}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                            >

                                {/* Blog Content */}
                                <div className="h-52 bg-gray-100">

                                    {blog.contentType === "image" && (
                                        <img
                                            src={blog.contentUrl}
                                            alt={blog.title}
                                            className="h-full w-full object-cover"
                                        />
                                    )}

                                    {blog.contentType === "gif" && (
                                        <img
                                            src={blog.contentUrl}
                                            alt={blog.title}
                                            className="h-full w-full object-cover"
                                        />
                                    )}

                                    {blog.contentType === "video" && (
                                        <video
                                            src={blog.contentUrl}
                                            controls
                                            className="h-full w-full object-cover"
                                        />
                                    )}

                                    {blog.contentType === "url" && (
                                        <div className="flex h-full items-center justify-center">
                                            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                                                External Link
                                            </span>
                                        </div>
                                    )}

                                </div>


                                {/* Blog Info */}
                                <div className="p-5">

                                    <div className="mb-3">
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-600">
                                            {blog.contentType}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900">
                                        {blog.title}
                                    </h3>

                                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                                        {blog.description}
                                    </p>


                                    {/* Actions */}
                                    <div className="mt-5 flex flex-wrap gap-2">

                                        <button
                                            onClick={() => {
                                                setEditingBlog(blog);

                                                setTimeout(() => {
                                                    editFormRef.current?.scrollIntoView({
                                                        behavior: "smooth",
                                                        block: "start"
                                                    });
                                                }, 0);
                                            }}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(blog._id)}
                                            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                        >
                                            Delete
                                        </button>

                                        {!openComments[blog._id] ? (
                                            <button
                                                onClick={() => fetchComments(blog._id)}
                                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                View Comments
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    setOpenComments((prev) => ({
                                                        ...prev,
                                                        [blog._id]: false
                                                    }))
                                                }
                                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Close Comments
                                            </button>
                                        )}

                                    </div>


                                    {/* Comments */}
                                    {openComments[blog._id] &&
                                        blogComments[blog._id]?.map((comment) => (

                                            <div
                                                key={comment._id}
                                                className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4"
                                            >

                                                <p className="font-semibold text-gray-900">
                                                    {comment.name}
                                                </p>

                                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                                    {comment.text}
                                                </p>

                                                <button
                                                    onClick={() =>
                                                        handleDeleteComment(
                                                            comment._id,
                                                            blog._id
                                                        )
                                                    }
                                                    className="mt-3 text-sm font-medium text-red-600 hover:text-red-700"
                                                >
                                                    Delete Comment
                                                </button>

                                            </div>

                                        ))}

                                </div>

                            </article>

                        ))}

                    </div>

                </section>

            </div>
        </div>
    );
};

export default Dashboard;