import React from "react";
import JobForm from "../components/common/JobForm";
import { BriefcaseBusiness, Sparkles, BookOpen, Lightbulb, Code } from "lucide-react";

const CreateJobPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">

      {/* Page Wrapper */}
      <div className="max-w-4xl mx-auto space-y-8">

        {/* 1. Header */}
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Glow background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/15 text-primary shrink-0">
              <BriefcaseBusiness className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                Create Scraper Job
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure extraction selectors and pagination boundaries for target sites.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-primary/10 border border-primary/15 text-primary px-3.5 py-1.5 rounded-full font-bold relative z-10 self-start sm:self-auto shrink-0 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Config Schema v1</span>
          </div>
        </div>

        {/* 2. Grid for Tips & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Form Container (8 cols) */}
          <div className="lg:col-span-8 bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xs relative">
            <div className="mb-6 pb-5 border-b border-border/50">
              <h2 className="text-lg font-bold text-foreground">Workspace Configuration</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complete the configuration metadata to assign target workers.
              </p>
            </div>

            <JobForm />
          </div>

          {/* Tips Section (4 cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Guidebook Card */}
            <div className="bg-card border border-border/85 rounded-3xl p-6 shadow-2xs relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

              <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-4">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>JSON Selector Guide</span>
              </h3>

              <ul className="space-y-3.5 text-xs text-muted-foreground leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Use accurate, standards-compliant CSS selectors to match DOM nodes.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>Ensure your selector configuration array uses exact quote indicators.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Attributes match DOM keys like <code className="px-1 py-0.5 rounded bg-muted font-mono text-[10px] text-foreground">href</code>, <code className="px-1 py-0.5 rounded bg-muted font-mono text-[10px] text-foreground">src</code>, or defaults to <code className="px-1 py-0.5 rounded bg-muted font-mono text-[10px] text-foreground">text</code>.</span>
                </li>
              </ul>
            </div>

            {/* Config Snippet Details */}
            <div className="bg-card border border-border/85 rounded-3xl p-6 shadow-2xs relative overflow-hidden">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
                <Code className="w-4 h-4 text-primary" />
                <span>Selector Schema</span>
              </h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                Below is the expected format for extracting individual dynamic elements:
              </p>

              <pre className="p-3 bg-background/50 border border-border/60 rounded-2xl font-mono text-[10px] text-muted-foreground leading-normal overflow-x-auto select-all">
                {`[
  {
    "name": "title",
    "selector": "h1.title",
    "attribute": "text"
  }
]`}
              </pre>

              <div className="mt-4 pt-3.5 border-t border-border/50 flex items-center gap-2 text-[10px] text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Need help? Check target site HTML structures.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CreateJobPage;