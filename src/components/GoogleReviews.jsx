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

  const reviews = data?.reviews?.slice(0, 3) || [];

  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-6xl px-4">

        <div className="text-center">
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
            <div className="mt-4">
              <div className="text-xl font-bold text-slate-900">
                ⭐ {data.rating} / 5
              </div>

              <p className="mt-1 text-slate-600">
                Based on {data.userRatingCount} Google reviews
              </p>
            </div>
          )}
        </div>

        {reviews.length > 0 && (
  <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
    {reviews.map((review) => (
      <div
        key={review.name}
        className="flex h-full flex-col rounded-2xl bg-slate-50 p-6 shadow-lg ring-1 ring-slate-200"
      >
        <div className="flex items-center gap-3">
          {review.authorAttribution?.photoUri && (
            <img
              src={review.authorAttribution.photoUri}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}

          <div className="text-left">
            <div className="font-bold text-slate-900">
              {review.authorAttribution?.displayName || "Google reviewer"}
            </div>

            <div className="text-sm text-slate-500">
              {review.relativePublishTimeDescription}
            </div>
          </div>
        </div>

        <div className="mt-4 text-left text-lg text-amber-400">
          {"★".repeat(review.rating || 0)}
        </div>

        <p className="mt-4 flex-1 whitespace-pre-line text-left leading-7 text-slate-700">
          “{review.text?.text || "Review text unavailable."}”
        </p>

        {review.googleMapsUri && (
          <a
            href={review.googleMapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block text-left font-semibold text-cyan-700 hover:text-cyan-900"
          >
            View original review on Google →
          </a>
        )}
      </div>
    ))}
  </div>
)}

              <div>
                <div className="font-bold text-slate-900">
                  {review.authorAttribution?.displayName || "Google reviewer"}
                </div>

                <div className="text-sm text-slate-500">
                  {review.relativePublishTimeDescription}
                </div>
              </div>
            </div>

            <div className="mt-4 text-lg">
              {"★".repeat(review.rating || 0)}
            </div>

            <p className="mt-4 whitespace-pre-line leading-7 text-slate-700">
              “{review.text?.text || "Review text unavailable."}”
            </p>

            {review.googleMapsUri && (
              <a
                href={review.googleMapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block font-semibold text-cyan-700 hover:text-cyan-900"
              >
                View original review on Google →
              </a>
            )}

          </div>
        )}

      </div>
    </section>
  );
}