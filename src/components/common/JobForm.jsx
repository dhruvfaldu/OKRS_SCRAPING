import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createJob } from "../../store/slices/jobSlice";
import { toast } from "sonner";
import { Plus, Globe, Code, Check, Sparkles, HelpCircle, FileJson, AlertCircle, ArrowRight } from "lucide-react";
import ButtonLoader from "../loaders/ButtonLoader";

const SELECTORS_TEMPLATE_BOOKS = `[
  {
    "name": "title",
    "selector": "article.product_pod h3 a",
    "attribute": "title"
  },
  {
    "name": "price",
    "selector": "article.product_pod .price_color"
  },
  {
    "name": "instock",
    "selector": "article.product_pod .availability"
  }
]`;

const SELECTORS_TEMPLATE_GENERIC = `[
  {
    "name": "title",
    "selector": "h1"
  },
  {
    "name": "description",
    "selector": "meta[name='description']",
    "attribute": "content"
  }
]`;

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
                selectorsError = err?.message || "Invalid JSON format";
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
            paginationError = err?.message || "Invalid JSON format";
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

    const loadTemplate = (templateStr) => {
        setForm((prev) => ({ ...prev, selectors: templateStr }));
        setTouched((prev) => ({ ...prev, selectors: true }));
        toast.info("Selectors template loaded!");
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

    const inputClass = "w-full bg-background/50 border border-border/80 text-foreground placeholder:text-muted-foreground/60 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-border transition-all duration-300";
    const labelClass = "text-sm font-semibold tracking-tight text-foreground flex items-center justify-between";

    return (
        <div className="text-foreground">
            <div className="w-full">
                <form
                    className="flex flex-col gap-6"
                    onSubmit={handleSubmit}
                >
                    {isSuccess && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-5 py-4 text-sm text-emerald-500 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold">✓</span>
                            <span>Job created successfully! Redirecting to jobs dashboard…</span>
                        </div>
                    )}

                    {isError && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-2xl px-5 py-4 text-sm flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
                            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                            <span>
                                {error?.response?.data?.message ||
                                    error?.message ||
                                    "Failed to create job"}
                            </span>
                        </div>
                    )}

                    {/* Job Name */}
                    <div className="flex flex-col gap-2">
                        <label className={labelClass}>
                            <span>Job Workspace Name <span className="text-red-500/80">*</span></span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Books Scraper Workflow"
                            className={`${inputClass} ${touched.name && errors.name ? "border-red-500/50 focus:ring-red-500/10 focus:border-red-500" : ""}`}
                            value={form.name}
                            onChange={onChangeField("name")}
                            onBlur={onBlurField("name")}
                        />
                        {touched.name && errors.name && (
                            <p className="text-xs font-semibold text-red-500/90 flex items-center gap-1.5 mt-1 animate-in fade-in duration-200">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* URL */}
                    <div className="flex flex-col gap-2">
                        <label className={labelClass}>
                            <span>Target Website URL <span className="text-red-500/80">*</span></span>
                        </label>
                        <input
                            type="url"
                            placeholder="https://books.toscrape.com"
                            className={`${inputClass} ${touched.url && errors.url ? "border-red-500/50 focus:ring-red-500/10 focus:border-red-500" : ""}`}
                            value={form.url}
                            onChange={onChangeField("url")}
                            onBlur={onBlurField("url")}
                        />
                        {touched.url && errors.url && (
                            <p className="text-xs font-semibold text-red-500/90 flex items-center gap-1.5 mt-1 animate-in fade-in duration-200">
                                <AlertCircle className="w-3.5 h-3.5" />
                                {errors.url}
                            </p>
                        )}
                    </div>

                    {/* Mode Selection */}
                    <div className="flex flex-col gap-3">
                        <label className={labelClass}>
                            <span>Scraping Mode</span>
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Full Page Card */}
                            <label
                                className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-28 ${form.mode === "full_page"
                                        ? "border-primary bg-primary/5 shadow-inner"
                                        : "border-border/80 bg-background/30 hover:border-border hover:bg-background/60"
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl transition-all duration-300 ${form.mode === "full_page"
                                                ? "bg-primary/20 text-primary border border-primary/20 scale-105"
                                                : "bg-muted text-muted-foreground border border-border/50 group-hover:scale-105"
                                            }`}>
                                            <Globe className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">Full HTML Page</p>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                                                Scrape the complete static page HTML body.
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        type="radio"
                                        name="mode"
                                        value="full_page"
                                        checked={form.mode === "full_page"}
                                        onChange={onChangeField("mode")}
                                        className="h-4 w-4 text-primary focus:ring-primary border-border bg-transparent mt-1 cursor-pointer"
                                    />
                                </div>
                                {form.mode === "full_page" && (
                                    <div className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-tl-xl text-[9px] font-bold flex items-center gap-0.5">
                                        <Check className="w-3 h-3" /> Selected
                                    </div>
                                )}
                            </label>

                            {/* Selectors Card */}
                            <label
                                className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-28 ${form.mode === "selectors"
                                        ? "border-primary bg-primary/5 shadow-inner"
                                        : "border-border/80 bg-background/30 hover:border-border hover:bg-background/60"
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl transition-all duration-300 ${form.mode === "selectors"
                                                ? "bg-primary/20 text-primary border border-primary/20 scale-105"
                                                : "bg-muted text-muted-foreground border border-border/50 group-hover:scale-105"
                                            }`}>
                                            <Code className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">CSS Selector Mode</p>
                                            <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                                                Extract target fields with robust CSS nodes.
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        type="radio"
                                        name="mode"
                                        value="selectors"
                                        checked={form.mode === "selectors"}
                                        onChange={onChangeField("mode")}
                                        className="h-4 w-4 text-primary focus:ring-primary border-border bg-transparent mt-1 cursor-pointer"
                                    />
                                </div>
                                {form.mode === "selectors" && (
                                    <div className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-tl-xl text-[9px] font-bold flex items-center gap-0.5">
                                        <Check className="w-3 h-3" /> Selected
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Scraper Mode Fields with micro transitions */}
                    {form.mode === "selectors" && (
                        <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">

                            {/* Selectors JSON */}
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-1">
                                    <label className={`${labelClass} flex-1`}>
                                        <span className="flex items-center gap-1.5">
                                            <FileJson className="w-4 h-4 text-primary" />
                                            <span>Selectors Configuration JSON <span className="text-red-500/80">*</span></span>
                                        </span>
                                    </label>

                                    {/* Template selection buttons */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider select-none">Templates:</span>
                                        <button
                                            type="button"
                                            onClick={() => loadTemplate(SELECTORS_TEMPLATE_BOOKS)}
                                            className="px-2.5 py-1 text-[10px] font-bold border border-border/80 bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition"
                                        >
                                            Books Shop
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => loadTemplate(SELECTORS_TEMPLATE_GENERIC)}
                                            className="px-2.5 py-1 text-[10px] font-bold border border-border/80 bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition"
                                        >
                                            Basic Title
                                        </button>
                                    </div>
                                </div>

                                <div className="relative group">
                                    {/* Line numbers mock or nice editor border decoration */}
                                    <div className="absolute top-3 left-3 select-none pointer-events-none text-right w-6 font-mono text-xs text-muted-foreground/30 hidden sm:block">
                                        {Array.from({ length: 9 }).map((_, i) => (
                                            <div key={i}>{i + 1}</div>
                                        ))}
                                    </div>

                                    <textarea
                                        rows={10}
                                        placeholder={`[\n  {\n    "name": "title",\n    "selector": "article.product_pod h3 a",\n    "attribute": "title"\n  },\n  {\n    "name": "price",\n    "selector": "article.product_pod .price_color"\n  }\n]`}
                                        className={`${inputClass} font-mono resize-y min-h-[220px] ${touched.selectors && errors.selectors ? "border-red-500/50 focus:ring-red-500/10 focus:border-red-500" : ""} sm:pl-11`}
                                        value={form.selectors}
                                        onChange={onChangeField("selectors")}
                                        onBlur={onBlurField("selectors")}
                                    />
                                </div>

                                {touched.selectors && errors.selectors && (
                                    <div className="text-xs bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl px-4 py-3 font-mono leading-relaxed mt-1 flex items-start gap-2.5 animate-in fade-in duration-200">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                                        <div>
                                            <span className="font-bold">JSON Schema Error:</span> {errors.selectors}
                                        </div>
                                    </div>
                                )}

                                {touched.selectors && !errors.selectors && trimmedSelectors && (
                                    <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1.5 mt-1 animate-in fade-in duration-200">
                                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500/15 text-[8px] font-bold">✓</span>
                                        <span>Validated: Config matches database constraints</span>
                                    </p>
                                )}
                            </div>

                            {/* Pagination JSON */}
                            <div className="flex flex-col gap-2">
                                <label className={labelClass}>
                                    <span className="flex items-center gap-1.5">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                        <span>Pagination Configuration JSON <span className="text-xs text-muted-foreground/80 font-normal">(Optional)</span></span>
                                    </span>
                                </label>

                                <div className="relative group">
                                    <div className="absolute top-3 left-3 select-none pointer-events-none text-right w-6 font-mono text-xs text-muted-foreground/30 hidden sm:block">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i}>{i + 1}</div>
                                        ))}
                                    </div>

                                    <textarea
                                        rows={4}
                                        placeholder={`{\n  "next_button": ".next a"\n}`}
                                        className={`${inputClass} font-mono resize-y min-h-[110px] ${touched.pagination && errors.pagination ? "border-red-500/50 focus:ring-red-500/10 focus:border-red-500" : ""} sm:pl-11`}
                                        value={form.pagination}
                                        onChange={onChangeField("pagination")}
                                        onBlur={onBlurField("pagination")}
                                    />
                                </div>

                                {touched.pagination && errors.pagination && (
                                    <div className="text-xs bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl px-4 py-3 font-mono leading-relaxed mt-1 flex items-start gap-2.5 animate-in fade-in duration-200">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                                        <div>
                                            <span className="font-bold">JSON Schema Error:</span> {errors.pagination}
                                        </div>
                                    </div>
                                )}

                                {touched.pagination && !errors.pagination && trimmedPagination && (
                                    <p className="text-xs font-semibold text-emerald-500 flex items-center gap-1.5 mt-1 animate-in fade-in duration-200">
                                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500/15 text-[8px] font-bold">✓</span>
                                        <span>Validated: Pagination parameter matches</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-border/50">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl border border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground text-sm font-semibold transition-all duration-200 cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={hasErrors || isPending}
                            className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 disabled:opacity-55 disabled:cursor-not-allowed text-sm font-bold shadow-md shadow-primary/10 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isPending ? (
                                <ButtonLoader text="Spawning worker" className="text-primary-foreground font-bold" />
                            ) : (
                                <>
                                    <Plus size={16} />
                                    <span>Create Scraper Workspace</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default JobForm;
