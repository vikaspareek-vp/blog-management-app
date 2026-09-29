import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/blogs"
                );

                setBlogs(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* Hero Section */}
            <section className="mb-14 text-center">

                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                    Welcome to Blog App
                </p>

                <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                    Explore Our Latest Stories
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-gray-500">
                    Discover interesting ideas, updates, and stories
                    from our latest blog posts.
                </p>

            </section>

            {/* Blog Grid */}
            <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">

                    {blogs.map((blog) => (
                        <Link
                            key={blog._id}
                            to={`/blog/${blog._id}`}
                            className="group block h-full"
                        >

                            <article className="h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                                {/* Media */}
                                <div className="relative h-60 overflow-hidden bg-gray-100">

                                    {blog.contentType === "image" && (
                                        <img
                                            src={blog.contentUrl}
                                            alt={blog.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    )}

                                    {blog.contentType === "gif" && (
                                        <img
                                            src={blog.contentUrl}
                                            alt={blog.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                                            <div className="text-center">

                                                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
                                                    🔗
                                                </div>

                                                <p className="font-medium text-blue-600">
                                                    External Link
                                                </p>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    Click to view
                                                </p>

                                            </div>
                                        </div>
                                    )}

                                    {/* Content Type Badge */}
                                    <div className="absolute left-4 top-4">

                                        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold capitalize shadow-sm backdrop-blur">
                                            {blog.contentType}
                                        </span>

                                    </div>

                                </div>

                                {/* Blog Information */}
                                <div className="flex flex-col p-5">

                                    <h2 className="text-xl font-bold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-blue-600 line-clamp-2">
                                        {blog.title}
                                    </h2>

                                    <p className="mt-3 text-sm leading-6 text-gray-600 line-clamp-3">
                                        {blog.description}
                                    </p>

                                    <div className="mt-5 flex items-center justify-between">

                                        <span className="text-sm font-medium text-blue-600">
                                            Read article
                                        </span>

                                        <span className="text-lg text-gray-400 transition-transform duration-200 group-hover:translate-x-1">
                                            →
                                        </span>

                                    </div>

                                </div>

                            </article>

                        </Link>
                    ))}

                </div>

                {/* No Blogs */}
                {blogs.length === 0 && (
                    <div className="py-20 text-center">

                        <p className="text-lg font-medium text-gray-600">
                            No blogs available yet.
                        </p>

                        <p className="mt-2 text-sm text-gray-400">
                            Check back later for new posts.
                        </p>

                    </div>
                )}

            </section>

        </div>
    );
};

export default Home;