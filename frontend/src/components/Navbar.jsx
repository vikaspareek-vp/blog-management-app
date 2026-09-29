import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <nav className="border-b bg-white">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
    <Link
      to="/"
      className="text-xl font-bold"
    >
      Blog App
    </Link>

    <div className="flex items-center gap-2 sm:gap-4">
      {token ? (
        <>
          <Link
            to="/admin/dashboard"
            className="text-sm font-medium text-gray-700 hover:text-black sm:text-base"
          >
            Dashboard
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-100 sm:px-4 sm:text-base"
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          to="/admin/login"
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-100 sm:px-4 sm:text-base"
        >
          Admin Login
        </Link>
      )}
    </div>
  </div>
</nav>
  );
};

export default Navbar;