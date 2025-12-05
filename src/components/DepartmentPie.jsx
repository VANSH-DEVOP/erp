import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function DepartmentPie() {
  const [departments, setDepartments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  // Pastel palette
  const pastelColors = [
  "#ff7b72", // contrast for #f8a5c2
  "#4aa8ff", // contrast for #9adcff
  "#5fb2e6", // contrast for #a3d8f4
  "#a38aff", // contrast for #c8b6ff
  "#63b6ff"  // contrast for #aee2ff
];


  // Fetch stats from backend
  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API_BASE_URL}/admin/dashboard/department-stats`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        // Backend: { departments: [ { dept, students, faculty } ] }
        const data = res.data?.departments || [];

        // Attach colors here (fallback if backend doesn't send any)
        const withColors = data.map((d, idx) => ({
          ...d,
          color: d.color || pastelColors[idx % pastelColors.length],
        }));

        setDepartments(withColors);
      } catch (err) {
        console.error("Error fetching department stats:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load department statistics. Try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // If no departments, avoid crashes
  const studentData = departments.map((d, index) => ({
    id: index,
    label: d.dept,
    value: Number(d.students ?? 0),
    color: d.color,
  }));

  const facultyData = departments.map((d, index) => ({
    id: index,
    label: d.dept,
    value: Number(d.faculty ?? 0),
    color: d.color,
  }));

  const totalStudents = studentData.reduce((a, c) => a + (c.value || 0), 0);
  const totalFaculty = facultyData.reduce((a, c) => a + (c.value || 0), 0);

  // Tooltip State
  const [tooltip, setTooltip] = React.useState({
    visible: false,
    x: 0,
    y: 0,
    label: "",
    value: 0,
    percent: "",
    type: "",
    color: "",
  });

  const showTooltip = (event, item, total, type) => {
    if (!item || item.value == null || !total) return;

    const percent = ((item.value / total) * 100).toFixed(1);

    setTooltip({
      visible: true,
      x: (event?.clientX ?? 0) + 15,
      y: (event?.clientY ?? 0) + 15,
      label: item.label,
      value: item.value,
      percent,
      type,
      color: item.color ?? "#c8b6ff",
    });
  };

  const hideTooltip = () => {
    setTooltip((t) => ({ ...t, visible: false }));
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" sx={{ color: "#6b6b6b", fontWeight: 500 }}>
          Loading department statistics...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography
          variant="h6"
          sx={{ color: "#e11d48", fontWeight: 500, mb: 1 }}
        >
          {error}
        </Typography>
      </Box>
    );
  }

  if (!departments.length) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" sx={{ color: "#6b6b6b", fontWeight: 500 }}>
          No department data available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: "center", mt: 5, position: "relative" }}>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontWeight: 700,
          color: "#b278c7",
          letterSpacing: "0.5px",
        }}
      >
        University Statistics
      </Typography>

      {/* Row that holds two fixed-width chart columns */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 6,
          padding: "10px",
        }}
      >
        {/* STUDENT COLUMN */}
        <Box
          sx={{
            width: 340,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <PieChart
            height={300}
            series={[
              {
                data: studentData,
                outerRadius: 120,
                innerRadius: 40,
                arcLabel: () => "",
                highlightScope: { fade: "global", highlight: "item" },
                highlighted: { additionalRadius: 12 },
              },
            ]}
            onPointerOver={(event, item) =>
              showTooltip(event, item, totalStudents, "Students")
            }
            onPointerOut={hideTooltip}
          />

          <Typography
            sx={{
              mt: 2,
              mr: 8,
              fontSize: "16px",
              color: "#6b6b6b",
              fontWeight: 600,
            }}
          >
            Students Distribution
          </Typography>
        </Box>

        {/* FACULTY COLUMN */}
        <Box
          sx={{
            width: 340,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <PieChart
            height={300}
            series={[
              {
                data: facultyData,
                outerRadius: 120,
                innerRadius: 40,
                arcLabel: () => "",
                highlightScope: { fade: "global", highlight: "item" },
                highlighted: { additionalRadius: 12 },
              },
            ]}
            onPointerOver={(event, item) =>
              showTooltip(event, item, totalFaculty, "Faculty")
            }
            onPointerOut={hideTooltip}
          />

          <Typography
            sx={{
              mt: 2,
              mr: 8,
              fontSize: "16px",
              color: "#6b6b6b",
              fontWeight: 600,
            }}
          >
            Faculty Distribution
          </Typography>
        </Box>
      </Box>

      {/* CUSTOM THEMED TOOLTIP */}
      {tooltip.visible && (
        <div
          style={{
            position: "fixed",
            top: tooltip.y,
            left: tooltip.x,
            background: "white",
            padding: "12px 16px",
            borderRadius: "12px",
            border: `2px solid ${tooltip.color}`,
            boxShadow: `0 6px 18px rgba(0,0,0,0.10)`,
            fontSize: "14px",
            zIndex: 1000,
            whiteSpace: "nowrap",
            transition: "all 0.12s ease",
            pointerEvents: "none",
          }}
        >
          <strong style={{ color: tooltip.color }}>{tooltip.label}</strong>
          <div style={{ marginTop: 6 }}>
            {tooltip.type}: <strong>{tooltip.value}</strong>
          </div>
          <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
            ({tooltip.percent}%)
          </div>
        </div>
      )}
    </Box>
  );
}
