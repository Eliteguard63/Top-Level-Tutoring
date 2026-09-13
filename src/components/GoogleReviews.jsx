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

  const reviews = data?.reviews || [];

  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-16">
      {/* soft background glows */}
      <div
        className="
          pointer-events-none absolute inset-0
          bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.08),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(139,92,246,0.08),transparent_30%)]
        "
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            What Students & Parents Are Saying
          </h2>

          {loading && (
            <p className="mt-5 text-slate-500">
              Loading Google reviews...
            </p>
          )}

          {error && (
            <div className="mx-auto mt-5 max-w-xl rounded-xl bg-red-100 p-4 text-red-800">
              Google reviews error: {error}
            </div>
          )}

          {data && (
            <div className="mt-5 flex flex-col items-center">
              {/* GOOGLE WORDMARK */}
              <img
                src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
                alt="Google"
                className="h-[30px] w-auto"
              />

              {/* RATING */}
              <div className="mt-3 flex items-center justify-center gap-3">
                <span className="text-xl font-bold text-slate-900">
                  {data.rating} / 5
                </span>

                <div
                  className="flex gap-0.5 text-xl text-amber-400"
                  aria-label={`${data.rating} out of 5 stars`}
                >
                  ★★★★★
                </div>
              </div>

              <a
                href={data.googleMapsLinks?.reviewsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 text-sm font-medium text-slate-600 hover:text-cyan-700 hover:underline"
              >
                Based on {data.userRatingCount} Google reviews
              </a>
            </div>
          )}
        </div>

        {/* REVIEW TRACK */}
        {reviews.length > 0 && (
          <div className="mt-10">
            <div
              className="
                flex snap-x snap-mandatory gap-5
                overflow-x-auto scroll-smooth pb-5
                [scrollbar-width:thin]
                [scrollbar-color:rgb(148_163_184)_transparent]
              "
            >
              {reviews.map((review) => (
                <article
                  key={review.name}
                  className="
                    flex min-h-[360px] shrink-0 snap-start flex-col
                    basis-[88%]
                    sm:basis-[calc(50%-10px)]
                    lg:basis-[calc(33.333%-14px)]
                    rounded-2xl bg-slate-50/95 p-6
                    shadow-[0_10px_30px_-12px_rgba(15,23,42,0.22)]
                    ring-1 ring-slate-200
                    transition duration-300
                    hover:-translate-y-1 hover:shadow-xl
                  "
                >
                  {/* AUTHOR */}
                  <div className="flex items-center gap-3">
                    {review.authorAttribution?.photoUri && (
                      <a
                        href={review.authorAttribution?.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0"
                      >
                        <img
                          src={review.authorAttribution.photoUri}
                          alt=""
                          className="h-12 w-12 rounded-full object-cover shadow-sm ring-2 ring-white"
                          referrerPolicy="no-referrer"
                        />
                      </a>
                    )}

                    <div className="min-w-0 text-left">
                      <a
                        href={review.authorAttribution?.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-slate-900 hover:text-cyan-700"
                      >
                        {review.authorAttribution?.displayName ||
                          "Google reviewer"}
                      </a>

                      <div className="mt-0.5 text-sm text-slate-500">
                        {review.relativePublishTimeDescription}
                      </div>
                    </div>
                  </div>

                  {/* STARS + GOOGLE LABEL */}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div
                      className="tracking-wide text-amber-400"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {"★".repeat(review.rating || 0)}
                    </div>

                    <span className="text-xs font-semibold text-slate-400">
                      Google Review
                    </span>
                  </div>

                  {/* REVIEW TEXT */}
                  <p className="mt-5 flex-1 whitespace-pre-line text-left text-[15px] leading-7 text-slate-700">
                    “{review.text?.text || "Review text unavailable."}”
                  </p>

                  {/* ORIGINAL REVIEW */}
                  {review.googleMapsUri && (
                    <a
                      href={review.googleMapsUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        mt-5 inline-flex items-center
                        text-left text-sm font-semibold
                        text-cyan-700 transition
                        hover:text-cyan-900
                      "
                    >
                      View original review on Google
                      <span className="ml-1" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  )}
                </article>
              ))}
            </div>

            {/* swipe hint */}
            <p className="mt-1 text-center text-xs text-slate-400 sm:hidden">
              Swipe to see more reviews
            </p>
          </div>
        )}

        {/* BOTTOM ACTIONS */}
        {data && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {data.googleMapsLinks?.reviewsUri && (
              <a
                href={data.googleMapsLinks.reviewsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center justify-center
                  rounded-full bg-slate-900 px-6 py-3
                  font-semibold text-white shadow
                  transition hover:bg-slate-800
                "
              >
                Read all {data.userRatingCount} reviews
              </a>
            )}

            {data.googleMapsLinks?.writeAReviewUri && (
              <a
                href={data.googleMapsLinks.writeAReviewUri}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center justify-center
                  rounded-full bg-white px-6 py-3
                  font-semibold text-slate-800
                  shadow-sm ring-1 ring-slate-300
                  transition hover:bg-slate-50
                "
              >
                Leave a Google review
              </a>
            )}
          </div>
        )}

        {/* ATTRIBUTION */}
        {data && (
          <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-relaxed text-slate-400">
            Reviews provided by Google Maps. Reviewer information, ratings,
            dates, and review text are shown from Google review data.
          </p>
        )}
      </div>
    </section>
  );
}