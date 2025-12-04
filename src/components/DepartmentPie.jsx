import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function DepartmentPie() {
  const departments = [
    { dept: "CSE", students: 400, faculty: 25, color: "#f8a5c2" },  // pastel pink
    { dept: "ECE", students: 320, faculty: 20, color: "#9adcff" },  // pastel sky blue
    { dept: "MECH", students: 210, faculty: 15, color: "#a3d8f4" }, // soft aqua
    { dept: "CIVIL", students: 170, faculty: 12, color: "#c8b6ff" }, // lavender
    { dept: "IT", students: 100, faculty: 10, color: "#aee2ff" },   // baby pink
  ];

  const studentData = departments.map((d, index) => ({
    id: index,
    label: d.dept,
    value: d.students,
    color: d.color,
  }));

  const facultyData = departments.map((d, index) => ({
    id: index,
    label: d.dept,
    value: d.faculty,
    color: d.color,
  }));

  const totalStudents = studentData.reduce((a, c) => a + c.value, 0);
  const totalFaculty = facultyData.reduce((a, c) => a + c.value, 0);

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
    if (!item) return;

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

      {/* --- Row that holds two fixed-width chart columns --- */}
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
            width: 340, // fixed width for perfect alignment
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

          {/* Label directly below the chart, centered */}
          <Typography
            sx={{
              mt: 2,
              mr:8,
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
            width: 340, // same fixed width for symmetry
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

          {/* Label directly below the chart, centered */}
          <Typography
            sx={{
              mt: 2,
              mr:8,
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
            boxShadow: "0 6px 18px rgba(0,0,0,0.10)",
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
