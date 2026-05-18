import React from "react";

const ResultsPage = () => {
  // 🔥 STATIC DATA (Backend ni jarur nathi)
  const results = [
    {
      title: "iPhone 15",
      price: "₹79,900",
      image: "https://via.placeholder.com/100",
      link: "https://example.com/iphone",
      rating: 4.5
    },
    {
      title: "Samsung S24",
      price: "₹74,999",
      image: "https://via.placeholder.com/100",
      link: "https://example.com/samsung",
      rating: 4.3
    },
    {
      title: "OnePlus 12",
      price: "₹64,999",
      image: "https://via.placeholder.com/100",
      link: "https://example.com/oneplus",
      rating: null
    },
    {
      title: "Pixel 8",
      price: "₹75,000",
      image: "https://via.placeholder.com/100",
      link: "https://example.com/pixel",
      specs: {
        ram: "8GB",
        storage: "128GB"
      }
    }
  ];

  // dynamic keys
  const allKeys = Array.from(
    new Set(results.flatMap((item) => Object.keys(item)))
  );

  return (
    <div className="p-6 bg-background text-foreground min-h-screen">

      <h1 className="text-2xl font-bold text-foreground mb-6">
        Scraped Results
      </h1>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">

        <table className="w-full text-sm text-left">

          {/* HEADER */}
          <thead>
            <tr className="bg-muted border-b border-border">

              <th className="py-3 px-4 text-muted-foreground w-10">#</th>

              {allKeys.map((key) => (
                <th
                  key={key}
                  className="py-3 px-4 text-foreground capitalize whitespace-nowrap"
                >
                  {key}
                </th>
              ))}

            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {results.map((row, i) => (
              <tr
                key={i}
                className={`
              border-b border-border
              hover:bg-muted/50
              ${i % 2 !== 0 ? "bg-muted/30" : ""}
              transition-colors
            `}
              >

                {/* Index */}
                <td className="py-3 px-4 text-muted-foreground text-xs">
                  {i + 1}
                </td>

                {allKeys.map((key) => {
                  const val = row[key];
                  let display;

                  if (val == null) {
                    display = (
                      <span className="text-muted-foreground italic">—</span>
                    );
                  }
                  else if (typeof val === "object") {
                    display = (
                      <code className="text-primary text-xs">
                        {JSON.stringify(val)}
                      </code>
                    );
                  }
                  else if (String(val).startsWith("http")) {
                    if (
                      String(val).endsWith(".jpg") ||
                      String(val).endsWith(".png")
                    ) {
                      display = (
                        <img
                          src={val}
                          alt=""
                          className="w-12 h-12 rounded object-cover border border-border"
                        />
                      );
                    } else {
                      display = (
                        <a
                          href={val}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline truncate block max-w-xs hover:opacity-80"
                        >
                          Open
                        </a>
                      );
                    }
                  }
                  else {
                    display = (
                      <span className="text-foreground">
                        {String(val)}
                      </span>
                    );
                  }

                  return (
                    <td key={key} className="py-3 px-4 max-w-xs">
                      {display}
                    </td>
                  );
                })}

              </tr>
            ))}
          </tbody>
        </table>

        {/* FOOTER */}
        <div className="px-4 py-2 text-xs text-muted-foreground bg-muted border-t border-border">
          {results.length} results
        </div>

      </div>
    </div>
  );
};

export default ResultsPage;