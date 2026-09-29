import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BlogDetails = () => {
    const { id } = useParams();

    const [blog, setBlog] = useState(null);
    const [likes, setLikes] = useState(0);

    const [comments, setComments] = useState([]);
    const [name, setName] = useState("");
    const [text, setText] = useState("");

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const blogResponse = await axios.get(
                    `http://localhost:5000/api/blogs/${id}`
                );

                setBlog(blogResponse.data);
                setLikes(blogResponse.data.likes);

                const commentsResponse = await axios.get(
                    `http://localhost:5000/api/blogs/${id}/comments`
                );

                setComments(commentsResponse.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBlog();
    }, [id]);

    const handleLike = async () => {
        try {
            const response = await axios.post(
                `http://localhost:5000/api/blogs/${id}/like`
            );

            setLikes(response.data.likes);
        } catch (error) {
            console.error(error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();

        if (!name.trim() || !text.trim()) {
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:5000/api/blogs/${id}/comments`,
                {
                    name,
                    text
                }
            );

            setComments((prev) => [
                ...prev,
                response.data.comment
            ]);

            setName("");
            setText("");
        } catch (error) {
            console.error(error);
        }
    };

    const handleShare = async () => {
        const shareUrl = window.location.href;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: blog.title,
                    text: blog.description,
                    url: shareUrl
                });
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(shareUrl);
                alert("Link copied!");
            } else {
                const textArea =
                    document.createElement("textarea");

                textArea.value = shareUrl;

                document.body.appendChild(textArea);
                textArea.select();

                document.execCommand("copy");

                document.body.removeChild(textArea);

                alert("Link copied!");
            }
        } catch (error) {
            console.error("Share error:", error);
        }
    };

    if (!blog) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-gray-500">
                    Loading blog...
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">

            {/* Blog Header */}
            <div className="mb-8">

                <div className="mb-4">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium capitalize text-blue-700">
                        {blog.contentType}
                    </span>
                </div>

                <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                    {blog.title}
                </h1>

                <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg">
                    {blog.description}
                </p>

            </div>

            {/* Blog Content */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">

                {blog.contentType === "image" && (
                    <img
                        src={blog.contentUrl}
                        alt={blog.title}
                        className="max-h-[600px] w-full object-contain"
                    />
                )}

                {blog.contentType === "gif" && (
                    <img
                        src={blog.contentUrl}
                        alt={blog.title}
                        className="max-h-[600px] w-full object-contain"
                    />
                )}

                {blog.contentType === "video" && (
                    <video
                        src={blog.contentUrl}
                        controls
                        className="max-h-[600px] w-full"
                    />
                )}

                {blog.contentType === "url" && (
                    <div className="flex min-h-[250px] items-center justify-center p-8">

                        <a
                            href={blog.contentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                        >
                            Open Link
                        </a>

                    </div>
                )}

            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-b border-gray-200 pb-6">

                <button
                    onClick={handleLike}
                    className="rounded-lg border border-gray-200 px-5 py-2.5 font-medium transition hover:bg-gray-100"
                >
                    ❤️ Like
                </button>

                <span className="text-gray-600">
                    {likes} {likes === 1 ? "Like" : "Likes"}
                </span>

                <button
                    onClick={handleShare}
                    className="rounded-lg border border-gray-200 px-5 py-2.5 font-medium transition hover:bg-gray-100"
                >
                    Share
                </button>

            </div>

            {/* Comments */}
            <section className="mt-8">

                <h2 className="text-2xl font-bold text-gray-900">
                    Comments
                </h2>

                {/* Add Comment */}
                <form
                    onSubmit={handleComment}
                    className="mt-5 rounded-xl border border-gray-200 p-5"
                >

                    <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                    />

                    <textarea
                        placeholder="Write a comment..."
                        value={text}
                        onChange={(e) =>
                            setText(e.target.value)
                        }
                        rows="4"
                        className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                    />

                    <button
                        type="submit"
                        className="mt-3 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
                    >
                        Add Comment
                    </button>

                </form>

                {/* Comment List */}
                <div className="mt-6 space-y-4">

                    {comments.length === 0 ? (
                        <p className="text-gray-500">
                            No comments yet. Be the first to comment!
                        </p>
                    ) : (
                        comments.map((comment) => (
                            <div
                                key={comment._id}
                                className="rounded-xl border border-gray-200 p-5"
                            >

                                <p className="font-semibold text-gray-900">
                                    {comment.name}
                                </p>

                                <p className="mt-2 leading-6 text-gray-600">
                                    {comment.text}
                                </p>

                            </div>
                        ))
                    )}

                </div>

            </section>

        </div>
    );
};

export default BlogDetails;