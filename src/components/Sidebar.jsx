import { useTheme } from "../context/ThemeContext";

function Sidebar() {
  const { theme, toggleTheme } = useTheme(); // ✅ جوه الكومبوننت

  return (
    <div className="sidebar">
      
      {/* باقي الكود بتاعك */}

      {/* قبل زرار logout */}
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

    </div>
  );
}

export default Sidebar;