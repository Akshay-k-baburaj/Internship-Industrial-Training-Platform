import { useState, useEffect } from "react";
import { getAllStudents } from "../../services/studentService";
import "./PlacementGlobal.css";

export default function PlacementAnalytics() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    async function calculateAnalytics() {
      try {
        const response = await getAllStudents();
        const students = response.data;
        const total = students.length;

        if (total === 0) {
          setMetrics(null);
          return;
        }

        // 1. Overall Placement Rate
        const placedCount = students.filter(s => s.isPlaced).length;
        const placementRate = ((placedCount / total) * 100).toFixed(1);

        // 2. Department Wise Stats
        const deptMap = {};
        students.forEach(s => {
          const dept = s.department || "Unknown";
          if (!deptMap[dept]) deptMap[dept] = { total: 0, placed: 0 };
          deptMap[dept].total++;
          if (s.isPlaced) deptMap[dept].placed++;
        });

        // 3. Avg CGPA of Placed Students
        const placedStudents = students.filter(s => s.isPlaced);
        const avgCgpa = placedStudents.length > 0
          ? (placedStudents.reduce((acc, s) => acc + (s.cgpa || 0), 0) / placedStudents.length).toFixed(2)
          : "N/A";

        setMetrics({
          total,
          placedCount,
          placementRate,
          deptStats: deptMap,
          avgCgpa
        });

      } catch (err) {
        console.error("Failed to load analytics data", err);
      } finally {
        setLoading(false);
      }
    }
    calculateAnalytics();
  }, []);

  if (loading) return <div className="placement-layout-container">Loading Analytics...</div>;
  if (!metrics) return <div className="placement-layout-container">No student data available for analytics.</div>;

  return (
    <div className="placement-layout-container">
      <div className="placement-header">
        <h1 className="placement-title">Placement Analytics</h1>
        <p className="placement-subtitle">Real-time insights based on student data</p>
      </div>

      <div className="form-grid" style={{ marginBottom: "3rem" }}>

        {/* KEY METRIC CARD: Placement Rate */}
        <div className="placement-card" style={{ padding: "2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "var(--text-secondary)" }}>Overall Placement Rate</h3>
          <div style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: `conic-gradient(var(--primary) ${metrics.placementRate}%, #e2e8f0 0)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1rem"
          }}>
            <div style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "var(--card-bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column"
            }}>
              <span style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text-main)" }}>{metrics.placementRate}%</span>
            </div>
          </div>
          <p style={{ color: "var(--text-secondary)" }}>{metrics.placedCount} / {metrics.total} Students Placed</p>
        </div>

        {/* KEY METRIC CARD: Avg CGPA */}
        <div className="placement-card" style={{ padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--text-secondary)" }}>Performance Metric</h3>
          <p style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>Average CGPA of Placed Students</p>

          <div style={{ fontSize: "4rem", fontWeight: 800, color: "var(--primary)" }}>
            {metrics.avgCgpa}
          </div>
          <p style={{ color: "var(--success)" }}> High Performance Cohort</p>
        </div>

      </div>

      {/* DEPARTMENT CHART */}
      <div className="placement-card" style={{ padding: "2.5rem" }}>
        <h3 className="form-section-title">Department-wise Performance</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {Object.entries(metrics.deptStats).map(([dept, stats]) => {
            const hasData = stats.total > 0;
            const percentage = hasData ? ((stats.placed / stats.total) * 100).toFixed(0) : 0;

            return (
              <div key={dept}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontWeight: 600 }}>{dept}</span>
                  <span style={{ color: "var(--text-secondary)" }}>{stats.placed}/{stats.total} Placed ({percentage}%)</span>
                </div>
                <div style={{
                  width: "100%",
                  height: "12px",
                  backgroundColor: "#e2e8f0",
                  borderRadius: "6px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: "100%",
                    backgroundColor: "var(--primary)",
                    borderRadius: "6px",
                    transition: "width 1s ease-out"
                  }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
