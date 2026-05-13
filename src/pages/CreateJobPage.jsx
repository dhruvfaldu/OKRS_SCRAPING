import JobForm from "../components/common/JobForm";
import { BriefcaseBusiness, Sparkles } from "lucide-react";

const CreateJobPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* Page Wrapper */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BriefcaseBusiness className="w-6 h-6 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Create New Job
              </h1>
            </div>

            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Setup a new scraping job by providing a valid JSON configuration.
              Make sure your selectors and attributes match your target website.
            </p>
          </div>

          {/* Optional Badge */}
          <div className="hidden sm:flex items-center gap-2 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
            <Sparkles className="w-4 h-4" />
            Smart Config Enabled
          </div>

        </div>

        {/* Tips Section */}
        <div className="bg-muted/60 border border-border rounded-xl p-5 mb-6 backdrop-blur">
          
          <p className="font-semibold mb-3 flex items-center gap-2">
            💡 JSON Config Tips
          </p>

          <ul className="list-disc list-inside text-muted-foreground space-y-2 text-xs sm:text-sm leading-relaxed">
            <li>Use accurate CSS selectors to target elements</li>
            <li>Ensure JSON is properly formatted (no trailing commas)</li>
            <li>Validate structure before submitting</li>

            <li className="break-words">
              Example:
              <code className="block mt-1 bg-background border border-border px-2 py-1 rounded text-primary text-xs break-all">
                {`{
  "selector": "h1",
  "attr": "text"
}`}
              </code>
            </li>
          </ul>
        </div>

        {/* Form Section */}
        <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm">
          
          {/* Section Title */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Job Configuration</h2>
            <p className="text-muted-foreground text-sm">
              Fill in the details below to create your job.
            </p>
          </div>

          {/* Form */}
          <JobForm />

        </div>

      </div>
    </div>
  );
};

export default CreateJobPage;