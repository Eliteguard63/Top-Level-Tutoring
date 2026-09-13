import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function GoogleReviews() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const trackRef = useRef(null);

  /* =========================
     LOAD GOOGLE REVIEW DATA
     ========================= */
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

  /* =========================
     RESPONSIVE CARD COUNT
     ========================= */
  useEffect(() => {
    function updateVisibleCount() {
      if (window.innerWidth >= 1024) {
        setVisibleCount(3);
      } else if (window.innerWidth >= 640) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    }

    updateVisibleCount();

    window.addEventListener("resize", updateVisibleCount);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
    };
  }, []);

  /* =========================
     REDUCED MOTION
     ========================= */
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const updateMotionPreference = () => {
      setReducedMotion(mediaQuery.matches);
    };

    updateMotionPreference();

    mediaQuery.addEventListener?.(
      "change",
      updateMotionPreference
    );

    return () => {
      mediaQuery.removeEventListener?.(
        "change",
        updateMotionPreference
      );
    };
  }, []);

  const maxIndex = Math.max(
    0,
    reviews.length - visibleCount
  );

  /* =========================
     SCROLL TO CARD
     ========================= */
  const scrollToIndex = useCallback(
    (requestedIndex) => {
      const track = trackRef.current;

      if (!track || reviews.length === 0) {
        return;
      }

      const targetIndex = Math.max(
        0,
        Math.min(requestedIndex, maxIndex)
      );

      const card = track.children[targetIndex];

      if (!card) {
        return;
      }

      const left =
        card.offsetLeft - track.offsetLeft;

      track.scrollTo({
        left,
        behavior: reducedMotion ? "auto" : "smooth",
      });

      setCurrentIndex(targetIndex);
    },
    [maxIndex, reducedMotion, reviews.length]
  );

  /* =========================
     PREVIOUS / NEXT
     ========================= */
  function previousReview() {
    if (currentIndex <= 0) {
      scrollToIndex(maxIndex);
    } else {
      scrollToIndex(currentIndex - 1);
    }
  }

  function nextReview() {
    if (currentIndex >= maxIndex) {
      scrollToIndex(0);
    } else {
      scrollToIndex(currentIndex + 1);
    }
  }

  /* =========================
     KEEP INDEX VALID ON RESIZE
     ========================= */
  useEffect(() => {
    if (currentIndex > maxIndex) {
      scrollToIndex(maxIndex);
    }
  }, [
    currentIndex,
    maxIndex,
    scrollToIndex,
  ]);

  /* =========================
     DETECT MANUAL SWIPING
     ========================= */
  function handleScroll() {
    const track = trackRef.current;

    if (!track || !track.children.length) {
      return;
    }

    let nearestIndex = 0;
    let nearestDistance = Infinity;

    Array.from(track.children).forEach(
      (card, index) => {
        if (index > maxIndex) {
          return;
        }

        const cardLeft =
          card.offsetLeft - track.offsetLeft;

        const distance = Math.abs(
          track.scrollLeft - cardLeft
        );

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      }
    );

    setCurrentIndex(nearestIndex);
  }

  /* =========================
     AUTO ADVANCE
     ========================= */
  useEffect(() => {
    if (
      paused ||
      reducedMotion ||
      reviews.length <= visibleCount ||
      maxIndex <= 0
    ) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      if (currentIndex >= maxIndex) {
        scrollToIndex(0);
      } else {
        scrollToIndex(currentIndex + 1);
      }
    }, 6500);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    currentIndex,
    maxIndex,
    paused,
    reducedMotion,
    reviews.length,
    scrollToIndex,
    visibleCount,
  ]);

  return (
    <section
      className="
        relative overflow-hidden
        bg-[linear-gradient(to_right,_#c7d2fe,_#e9d5ff,_#bae6fd)]
        px-4 pb-12 pt-6
        sm:px-6 sm:pb-14 sm:pt-8
      "
    >
      <div className="mx-auto max-w-[1180px]">

        {/* LARGE REVIEW WIDGET SHELL */}
        <div
          className="
            relative overflow-hidden
            rounded-[30px]
            bg-white/90
            px-4 py-7
            shadow-[0_20px_60px_-20px_rgba(15,23,42,0.28)]
            ring-1 ring-white/80
            backdrop-blur-xl
            sm:px-7 sm:py-8
            lg:px-9
          "
        >
          {/* subtle internal glow */}
          <div
            className="
              pointer-events-none absolute inset-0
              bg-[radial-gradient(circle_at_10%_10%,rgba(34,211,238,0.09),transparent_28%),radial-gradient(circle_at_90%_90%,rgba(139,92,246,0.09),transparent_28%)]
            "
          />

          <div className="relative z-10">

            {/* =====================
                HEADER
                ===================== */}
            <div className="text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                What Students & Parents Are Saying
              </h2>

              {loading && (
                <p className="mt-4 text-sm text-slate-500">
                  Loading Google reviews...
                </p>
              )}

              {error && (
                <div className="mx-auto mt-4 max-w-xl rounded-xl bg-red-100 p-4 text-red-800">
                  Google reviews error: {error}
                </div>
              )}

              {data && (
                <div className="mt-4 flex flex-col items-center">

                  {/* GOOGLE WORDMARK */}
                  <img
                    src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
                    alt="Google"
                    className="h-[26px] w-auto"
                  />

                  {/* RATING */}
                  <div className="mt-2 flex items-center justify-center gap-2.5">
                    <span className="text-lg font-bold text-slate-900">
                      {data.rating} / 5
                    </span>

                    <div
                      className="text-lg tracking-wide text-amber-400"
                      aria-label={`${data.rating} out of 5 stars`}
                    >
                      ★★★★★
                    </div>
                  </div>

                  <a
                    href={data.googleMapsLinks?.reviewsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 text-xs font-medium text-slate-500 hover:text-cyan-700 hover:underline"
                  >
                    Based on {data.userRatingCount} Google reviews
                  </a>
                </div>
              )}
            </div>

            {/* =====================
                CAROUSEL
                ===================== */}
            {reviews.length > 0 && (
              <div
                className="relative mt-7"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onFocusCapture={() => setPaused(true)}
                onBlurCapture={() => setPaused(false)}
              >

                {/* LEFT ARROW */}
                {reviews.length > visibleCount && (
                  <button
                    type="button"
                    onClick={previousReview}
                    aria-label="Show previous Google reviews"
                    className="
                      absolute left-0 top-1/2 z-20
                      -translate-x-2 -translate-y-1/2
                      rounded-full bg-white p-2.5
                      shadow-lg ring-1 ring-slate-200
                      transition
                      hover:scale-105 hover:bg-slate-50
                      active:scale-95
                      sm:-translate-x-3
                    "
                  >
                    <ChevronLeft className="h-5 w-5 text-slate-800" />
                  </button>
                )}

                {/* REVIEW TRACK */}
                <div
                  ref={trackRef}
                  onScroll={handleScroll}
                  onPointerDown={() => setPaused(true)}
                  onPointerUp={() => setPaused(false)}
                  onPointerCancel={() => setPaused(false)}
                  className="
                    flex cursor-grab snap-x snap-mandatory gap-4
                    overflow-x-auto scroll-smooth
                    px-1 pb-4
                    active:cursor-grabbing
                    [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden
                  "
                >
                  {reviews.map((review) => (
                    <article
                      key={review.name}
                      className="
                        flex h-[310px] shrink-0 snap-start flex-col
                        basis-[92%]
                        sm:basis-[calc(50%-8px)]
                        lg:basis-[calc(33.333%-11px)]
                        rounded-2xl
                        bg-slate-50/95
                        p-5
                        shadow-[0_8px_24px_-12px_rgba(15,23,42,0.25)]
                        ring-1 ring-slate-200
                        transition duration-300
                        hover:-translate-y-1 hover:shadow-lg
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
                              className="h-10 w-10 rounded-full object-cover shadow-sm ring-2 ring-white"
                              referrerPolicy="no-referrer"
                            />
                          </a>
                        )}

                        <div className="min-w-0 text-left">
                          <a
                            href={review.authorAttribution?.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate text-sm font-bold text-slate-900 hover:text-cyan-700"
                          >
                            {review.authorAttribution?.displayName ||
                              "Google reviewer"}
                          </a>

                          <div className="mt-0.5 text-xs text-slate-500">
                            {review.relativePublishTimeDescription}
                          </div>
                        </div>
                      </div>

                      {/* STARS + GOOGLE LABEL */}
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div
                          className="text-sm tracking-wide text-amber-400"
                          aria-label={`${review.rating} out of 5 stars`}
                        >
                          {"★".repeat(review.rating || 0)}
                        </div>

                        <span className="text-[11px] font-semibold text-slate-400">
                          Google Review
                        </span>
                      </div>

                      {/* REVIEW TEXT */}
                      <div className="relative mt-4 flex-1 overflow-hidden">
                        <p className="text-left text-sm leading-6 text-slate-700">
                          “{review.text?.text ||
                            "Review text unavailable."}”
                        </p>

                        {/* fade long reviews toward bottom */}
                        <div
                          className="
                            pointer-events-none
                            absolute inset-x-0 bottom-0 h-12
                            bg-gradient-to-t
                            from-slate-50
                            via-slate-50/90
                            to-transparent
                          "
                        />
                      </div>

                      {/* ORIGINAL REVIEW */}
                      {review.googleMapsUri && (
                        <a
                          href={review.googleMapsUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            relative z-10 mt-3
                            inline-flex items-center
                            text-left text-xs font-semibold
                            text-cyan-700 transition
                            hover:text-cyan-900
                          "
                        >
                          Read full review on Google
                          <span
                            className="ml-1"
                            aria-hidden="true"
                          >
                            ↗
                          </span>
                        </a>
                      )}
                    </article>
                  ))}
                </div>

                {/* RIGHT ARROW */}
                {reviews.length > visibleCount && (
                  <button
                    type="button"
                    onClick={nextReview}
                    aria-label="Show next Google reviews"
                    className="
                      absolute right-0 top-1/2 z-20
                      translate-x-2 -translate-y-1/2
                      rounded-full bg-white p-2.5
                      shadow-lg ring-1 ring-slate-200
                      transition
                      hover:scale-105 hover:bg-slate-50
                      active:scale-95
                      sm:translate-x-3
                    "
                  >
                    <ChevronRight className="h-5 w-5 text-slate-800" />
                  </button>
                )}

                {/* PAGINATION DOTS */}
                {maxIndex > 0 && (
                  <div className="mt-2 flex items-center justify-center gap-2">
                    {Array.from({
                      length: maxIndex + 1,
                    }).map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => scrollToIndex(index)}
                        aria-label={`Show review group ${index + 1}`}
                        aria-current={
                          currentIndex === index
                            ? "true"
                            : undefined
                        }
                        className={`
                          h-2 rounded-full transition-all duration-300
                          ${
                            currentIndex === index
                              ? "w-6 bg-cyan-600"
                              : "w-2 bg-slate-300 hover:bg-slate-400"
                          }
                        `}
                      />
                    ))}
                  </div>
                )}

                {/* MOBILE SWIPE HINT */}
                <p className="mt-2 text-center text-[11px] text-slate-400 sm:hidden">
                  Swipe to see more reviews
                </p>
              </div>
            )}

            {/* =====================
                BOTTOM ACTIONS
                ===================== */}
            {data && (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">

                {data.googleMapsLinks?.reviewsUri && (
                  <a
                    href={data.googleMapsLinks.reviewsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex items-center justify-center
                      rounded-full bg-slate-900 px-5 py-2.5
                      text-sm font-semibold text-white shadow
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
                      rounded-full bg-white px-5 py-2.5
                      text-sm font-semibold text-slate-800
                      shadow-sm ring-1 ring-slate-300
                      transition hover:bg-slate-50
                    "
                  >
                    Leave a Google review
                  </a>
                )}
              </div>
            )}

            {/* =====================
                ATTRIBUTION
                ===================== */}
            {data && (
              <p className="mx-auto mt-4 max-w-2xl text-center text-[10px] leading-relaxed text-slate-400">
                Reviews provided by Google Maps. Reviewer information,
                ratings, dates, and review text are shown from Google
                review data.
              </p>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}