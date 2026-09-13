import { useEffect, useState } from "react";

export default function GoogleReviews() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      try {
        const response = await fetch("/api/google-reviews");

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error("Google reviews fetch failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadReviews();
  }, []);

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-3xl font-bold text-slate-900">
          What Students & Parents Are Saying
        </h2>

        {loading && (
          <p className="mt-4 text-slate-500">
            Loading Google reviews...
          </p>
        )}

        {error && (
          <div className="mt-4 rounded-lg bg-red-100 p-4 text-red-800">
            Google reviews error: {error}
          </div>
        )}

        {data && (
          <div className="mt-5">
            <div className="text-2xl font-bold text-slate-900">
              ⭐ {data.rating} / 5
            </div>

            <p className="mt-2 text-slate-600">
              Based on {data.userRatingCount} Google reviews
            </p>

            <p className="mt-2 text-sm text-emerald-700 font-semibold">
              Google review data loaded successfully.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}