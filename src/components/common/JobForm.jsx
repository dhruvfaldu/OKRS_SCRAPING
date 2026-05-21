
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createJob } from "../../store/slices/jobSlice";
import { toast } from "react-toastify";

function JobForm() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [form, setForm] = useState({
        name: "",
        url: "",
        mode: "full_page",
        selectors: "",
        pagination: "",
    });

    const [touched, setTouched] = useState({
        name: false,
        url: false,
        mode: false,
        selectors: false,
        pagination: false,
    });

    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);

    const trimmedName = form.name.trim();
    const trimmedUrl = form.url.trim();
    const trimmedSelectors = form.selectors.trim();
    const trimmedPagination = form.pagination.trim();

    let parsedSelectors = null;
    let selectorsError = "";

    let parsedPagination = null;
    let paginationError = "";

    // Validate selectors JSON when scraper mode is selected
    if (form.mode === "selectors") {
        if (!trimmedSelectors) {
            selectorsError = "Selectors JSON is required";
        } else {
            try {
                parsedSelectors = JSON.parse(trimmedSelectors);

                if (!Array.isArray(parsedSelectors)) {
                    selectorsError =
                        "Selectors JSON must be an array of selector objects";
                } else if (parsedSelectors.length === 0) {
                    selectorsError =
                        "Selectors JSON must contain at least one selector";
                } else {
                    for (let i = 0; i < parsedSelectors.length; i++) {
                        const item = parsedSelectors[i];

                        if (item === null || Array.isArray(item) || typeof item !== "object") {
                            selectorsError = `Selector at index ${i} must be a valid object`;
                            break;
                        }

                        if (typeof item.name !== "string" || !item.name.trim()) {
                            selectorsError = `Selector at index ${i} is missing required "name"`;
                            break;
                        }

                        if (typeof item.selector !== "string" || !item.selector.trim()) {
                            selectorsError = `Selector "${item.name}" is missing required "selector"`;
                            break;
                        }

                        if (item.attribute !== undefined && item.attribute !== null && typeof item.attribute !== "string") {
                            selectorsError = `Selector "${item.name}" has invalid "attribute"`;
                            break;
                        }
                    }
                }
            } catch (err) {
                selectorsError = err?.message || "Invalid JSON";
            }
        }
    }

    // Validate pagination JSON (optional)
    if (form.mode === "selectors" && trimmedPagination) {
        try {
            parsedPagination = JSON.parse(trimmedPagination);

            if (parsedPagination === null || Array.isArray(parsedPagination) || typeof parsedPagination !== "object") {
                paginationError = "Pagination JSON must be a valid object";
            }
        } catch (err) {
            paginationError = err?.message || "Invalid JSON";
        }
    }

    const isValidHttpUrl = (value) => {
        try {
            const parsed = new URL(value);
            return (parsed.protocol === "http:" || parsed.protocol === "https:");
        } catch {
            return false;
        }
    };

    const errors = {
        name: !trimmedName ? "Job name is required" : "",
        url: !trimmedUrl
            ? "Target URL is required"
            : !isValidHttpUrl(trimmedUrl)
                ? "Enter a valid URL (http/https)"
                : "",
        selectors: selectorsError,
        pagination: paginationError,
    };

    const hasErrors = Boolean(
        errors.name ||
        errors.url ||
        errors.selectors ||
        errors.pagination
    );

    const onChangeField = (field) => (event) => {
        const value =
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value;

        setForm((prev) => ({ ...prev, [field]: value, }));
    };

    const onBlurField = (field) => () => {
        setTouched((prev) => ({ ...prev, [field]: true, }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setTouched({
            name: true,
            url: true,
            mode: true,
            selectors: true,
            pagination: true,
        });

        if (hasErrors || isPending) return;

        setIsPending(true);
        setIsError(false);
        setError(null);

        try {
            const payload = {
                name: trimmedName,
                url: trimmedUrl,
                mode: form.mode,
            };

            if (form.mode === "selectors") {
                payload.selectors = parsedSelectors;

                if (parsedPagination) {
                    payload.pagination = parsedPagination;
                }
            }

            await dispatch(createJob(payload)).unwrap();

            setIsSuccess(true);
            toast.success("Job created successfully!");

            setTimeout(() => {
                navigate("/");
            }, 600);
        } catch (err) {
            setIsError(true);
            setError(err);
            toast.error(err?.response?.data?.message || err?.message || "Failed to create job");
        } finally {
            setIsPending(false);
        }
    };

    const inputClass = "w-full bg-input border border-border text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-all";

    return (
        <div className="text-foreground">
            <div className="w-full max-w-2xl">
                <form
                    className="flex flex-col gap-5"
                    onSubmit={handleSubmit}
                >
                    {isSuccess && (
                        <div className="bg-green-500/10 border border-green-500 rounded-xl px-4 py-3 text-sm text-green-600">
                            ✓ Job created! Redirecting to jobs list…
                        </div>
                    )}

                    {isError && (
                        <div className="bg-destructive/10 border border-destructive text-destructive rounded-xl px-4 py-3 text-sm">
                            ⚠{" "}
                            {error?.response?.data?.message ||
                                error?.message ||
                                "Failed to create job"}
                        </div>
                    )}

                    {/* Job Name */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">
                            Job Name *
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Books to Scrape Demo"
                            className={inputClass}
                            value={form.name}
                            onChange={onChangeField("name")}
                            onBlur={onBlurField("name")}
                        />
                        {touched.name && errors.name && (
                            <p className="text-xs text-destructive">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* URL */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">
                            Target URL *
                        </label>
                        <input
                            type="url"
                            placeholder="https://books.toscrape.com"
                            className={inputClass}
                            value={form.url}
                            onChange={onChangeField("url")}
                            onBlur={onBlurField("url")}
                        />
                        {touched.url && errors.url && (
                            <p className="text-xs text-destructive">
                                {errors.url}
                            </p>
                        )}
                    </div>

                    {/* Mode */}
                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium">
                            Scraping Mode *
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label
                                className={`cursor-pointer rounded-xl border px-4 py-3 transition-all ${form.mode === "full_page"
                                    ? "border-primary bg-primary/10"
                                    : "border-border"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="mode"
                                        value="full_page"
                                        checked={
                                            form.mode === "full_page"
                                        }
                                        onChange={onChangeField("mode")}
                                        className="h-4 w-4"
                                    />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Full Page
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Scrape complete page HTML
                                        </p>
                                    </div>
                                </div>
                            </label>

                            <label
                                className={`cursor-pointer rounded-xl border px-4 py-3 transition-all ${form.mode === "selectors"
                                    ? "border-primary bg-primary/10"
                                    : "border-border"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="mode"
                                        value="selectors"
                                        checked={
                                            form.mode === "selectors"
                                        }
                                        onChange={onChangeField("mode")}
                                        className="h-4 w-4"
                                    />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Selector Mode
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Use CSS selectors & optional
                                            pagination
                                        </p>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Scraper Mode Fields */}
                    {form.mode === "selectors" && (
                        <>
                            {/* Selectors JSON */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium">
                                    Selectors JSON *
                                </label>

                                <textarea
                                    rows={10}
                                    placeholder={`[\n  {\n    "name": "title",\n    "selector": "article.product_pod h3 a",\n    "attribute": "title"\n  },\n  {\n    "name": "price",\n    "selector": "article.product_pod .price_color"\n  }\n]`}
                                    className={`${inputClass} font-mono resize-y min-h-[180px]`}
                                    value={form.selectors}
                                    onChange={onChangeField("selectors")}
                                    onBlur={onBlurField("selectors")}
                                />
                            </div>

                            {touched.selectors &&
                                errors.selectors && (
                                    <p className="text-xs bg-destructive/10 border border-destructive text-destructive rounded-lg px-3 py-2 font-mono">
                                        JSON Error:{" "}
                                        {errors.selectors}
                                    </p>
                                )}

                            {touched.selectors &&
                                !errors.selectors &&
                                trimmedSelectors && (
                                    <p className="text-xs text-primary">
                                        ✓ Valid JSON
                                    </p>
                                )}

                            {/* Pagination JSON */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium">
                                    Pagination JSON
                                    <span className="ml-2 text-xs text-muted-foreground">
                                        (Optional)
                                    </span>
                                </label>

                                <textarea
                                    rows={5}
                                    placeholder={`{\n  "next_button": ".next a"\n}`}
                                    className={`${inputClass} font-mono resize-y min-h-[100px]`}
                                    value={form.pagination}
                                    onChange={onChangeField("pagination")}
                                    onBlur={onBlurField("pagination")}
                                />

                                {touched.pagination &&
                                    errors.pagination && (
                                        <p className="text-xs bg-destructive/10 border border-destructive text-destructive rounded-lg px-3 py-2 font-mono">
                                            JSON Error:{" "}
                                            {errors.pagination}
                                        </p>
                                    )}

                                {touched.pagination &&
                                    !errors.pagination &&
                                    trimmedPagination && (
                                        <p className="text-xs text-primary">
                                            ✓ Valid JSON
                                        </p>
                                    )}
                            </div>
                        </>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground text-sm font-medium transition-all"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={hasErrors || isPending}
                            className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={16} />
                            {isPending ? "Creating..." : "Create Job"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default JobForm;
