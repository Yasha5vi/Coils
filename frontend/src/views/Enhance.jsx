import React, { useState } from "react";

const Enhance = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleEnhance = async () => {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          headline: "Sample headline",
          summary: "Sample summary",
          skills: "Java, React"
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Resume Enhancer</h2>

      <button onClick={handleEnhance}>
        {loading ? "Enhancing..." : "Enhance Resume"}
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Suggestions:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Enhance;
