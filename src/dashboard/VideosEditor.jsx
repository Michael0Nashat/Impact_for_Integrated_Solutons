import { useState, useEffect } from "react";

const API = "https://impact-for-integrated-solutons-serv.vercel.app/api/project-videos";

const styles = {
  container: {
    background: "#1e293b",
    padding: 24,
    borderRadius: 12,
    color: "#fff",
  },

  title: {
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
    marginBottom: 30,
  },

  input: {
    padding: "12px 15px",
    borderRadius: 8,
    border: "1px solid #475569",
    background: "#0f172a",
    color: "#fff",
    fontSize: 15,
    outline: "none",
  },

  select: {
    padding: "12px 15px",
    borderRadius: 8,
    border: "1px solid #475569",
    background: "#0f172a",
    color: "#fff",
    fontSize: 15,
    outline: "none",
  },

  addButton: {
    padding: "12px",
    background: "#ffc107",
    color: "#000",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 15,
  },

  addButtonDisabled: {
    padding: "12px",
    background: "#5c5334",
    color: "#999",
    border: "none",
    borderRadius: 8,
    cursor: "not-allowed",
    fontWeight: "bold",
    fontSize: 15,
  },

  error: {
    color: "#f87171",
    fontSize: 14,
  },

  empty: {
    color: "#94a3b8",
    fontSize: 14,
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 15,
  },

  card: {
    background: "#334155",
    padding: 20,
    borderRadius: 10,
    border: "1px solid #475569",
  },

  cardTitle: {
    margin: "0 0 10px",
    color: "#fff",
  },

  provider: {
    color: "#facc15",
    fontSize: 14,
    marginBottom: 8,
  },

  link: {
    color: "#38bdf8",
    textDecoration: "none",
    wordBreak: "break-all",
    display: "block",
    marginBottom: 15,
  },

  deleteButton: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default function VideosEditor({ token }) {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [provider, setProvider] = useState("youtube");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setVideos(Array.isArray(data) ? data : []);
    } catch {
      setError("تعذر تحميل الفيديوهات");
    }
  }

  async function addVideo() {
    if (!title.trim() || !url.trim()) {
      setError("الرجاء إدخال العنوان والرابط");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, url, provider }),
      });

      if (!res.ok) throw new Error("فشل حفظ الفيديو");

      setTitle("");
      setUrl("");
      setProvider("youtube");
      await loadVideos();
    } catch {
      setError("فشل حفظ الفيديو");
    } finally {
      setSaving(false);
    }
  }

  async function deleteVideo(id) {
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await loadVideos();
    } catch {
      setError("فشل حذف الفيديو");
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>إدارة الفيديوهات</h2>

      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="عنوان الفيديو"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="رابط الفيديو"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <select
          style={styles.select}
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
        >
          <option value="youtube">YouTube</option>
          <option value="vimeo">Vimeo</option>
          <option value="streamable">Streamable</option>
          <option value="google_drive">Google Drive</option>
          <option value="cloudinary">Cloudinary</option>
          <option value="mp4">MP4 (رابط مباشر)</option>
          <option value="other">أخرى (Jumpshare وغيرها)</option>
        </select>

        {error && <div style={styles.error}>{error}</div>}

        <button
          style={saving ? styles.addButtonDisabled : styles.addButton}
          onClick={addVideo}
          disabled={saving}
        >
          {saving ? "جاري الإضافة..." : "إضافة فيديو"}
        </button>
      </div>

      <div style={styles.list}>
        {videos.length === 0 && (
          <div style={styles.empty}>لا توجد فيديوهات مضافة بعد</div>
        )}

        {videos.map((video) => (
          <div key={video.id} style={styles.card}>
            <h3 style={styles.cardTitle}>{video.title}</h3>

            <div style={styles.provider}>{video.provider}</div>

            <a href={video.url} target="_blank" rel="noreferrer" style={styles.link}>
              {video.url}
            </a>

            <button style={styles.deleteButton} onClick={() => deleteVideo(video.id)}>
              حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}