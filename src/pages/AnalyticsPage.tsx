import React, { useState } from 'react';
import { ReviewerHeader } from '../components/layout/ReviewerHeader';

type TimeRange = 'Last 7 days' | 'Last 30 days' | 'Last 90 days' | 'Custom';

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('Last 30 days');
  const [exportNotice, setExportNotice] = useState(false);

  const weeklyClaims = [
    { week: 'W1', count: 12 },
    { week: 'W2', count: 15 },
    { week: 'W3', count: 18 },
    { week: 'W4', count: 16 },
    { week: 'W5', count: 22 },
    { week: 'W6', count: 19 },
    { week: 'W7', count: 21 },
    { week: 'W8', count: 19 },
  ];

  const maxWeekly = Math.max(...weeklyClaims.map((w) => w.count));

  const serviceData = [
    { service: 'Flights', bookings: 668, claims: 74, rate: '11.1%', barColor: 'bg-[#0d6b63]' },
    { service: 'Hotels', bookings: 270, claims: 29, rate: '10.7%', barColor: 'bg-[#20B8B0]' },
    { service: 'Trains', bookings: 154, claims: 17, rate: '11.0%', barColor: 'bg-[#0d3d3a]' },
    { service: 'Buses', bookings: 116, claims: 13, rate: '11.2%', barColor: 'bg-[#b45309]' },
    { service: 'Cabs', bookings: 76, claims: 9, rate: '11.8%', barColor: 'bg-[#475569]' },
  ];

  const claimReasons = [
    { reason: 'Cancelled by provider', count: 82, pct: '57.7%' },
    { reason: 'Long delay or disruption', count: 34, pct: '23.9%' },
    { reason: 'Schedule change', count: 16, pct: '11.3%' },
    { reason: 'Other', count: 10, pct: '7.1%' },
  ];

  const whereClaimsAreNow = [
    { stage: 'Under AI review', count: 46, color: 'text-[#0d6b63] bg-[#e8f2f0]' },
    { stage: 'With reviewers', count: 38, color: 'text-[#b45309] bg-[#fffbeb]' },
    { stage: 'Sent to providers', count: 27, color: 'text-[#1d4ed8] bg-[#eff6ff]' },
    { stage: 'Decided by providers', count: 31, color: 'text-[#166534] bg-[#ecfdf5]' },
  ];

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] flex flex-col font-sans text-[#192524] antialiased">
      <ReviewerHeader />

      {exportNotice && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-[#0a3635] text-white font-semibold shadow-2xl flex items-center gap-2.5 text-xs animate-fade-in border border-[#185e5b]">
          <span className="material-symbols-outlined text-[18px] text-[#20B8B0]">download_done</span>
          <span>Analytics report for {timeRange} exported successfully!</span>
        </div>
      )}

      <main className="flex-1 w-full site-container py-6 text-left space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#e3ded4] gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0d3d3a] tracking-tight">
              Analytics
            </h1>
            <p className="text-xs sm:text-sm text-[#5c6967] mt-0.5">
              Bookings and refund-assistance activity across all services.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="self-start sm:self-auto border border-[#0d6b63] text-[#0d6b63] bg-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-[#e8f2f0] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">ios_share</span>
            Export report
          </button>
        </div>

        {/* Time Range Pills (Page 12) */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {(['Last 7 days', 'Last 30 days', 'Last 90 days', 'Custom'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                timeRange === range
                  ? 'bg-[#0d6b63] text-white shadow-sm'
                  : 'bg-white border border-[#e3ded4] text-[#42504e] hover:bg-[#eae4d8]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* 4 PRIMARY METRIC KPI CARDS (Page 12) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Bookings */}
          <div className="bg-white rounded-xl border border-[#e3ded4] p-5 shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-[#889593] uppercase tracking-wider block">
              Bookings
            </span>
            <div className="text-3xl font-bold text-[#0d3d3a]">1,284</div>
            <div className="text-xs text-[#166534] font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+12% vs previous period</span>
            </div>
          </div>

          {/* 2. Refund Claims */}
          <div className="bg-white rounded-xl border border-[#e3ded4] p-5 shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-[#889593] uppercase tracking-wider block">
              Refund Claims
            </span>
            <div className="text-3xl font-bold text-[#0d3d3a]">142</div>
            <div className="text-xs text-[#5c6967] font-medium">
              11% of bookings
            </div>
          </div>

          {/* 3. AI Reviews Completed */}
          <div className="bg-white rounded-xl border border-[#e3ded4] p-5 shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-[#889593] uppercase tracking-wider block">
              AI Reviews Completed
            </span>
            <div className="text-3xl font-bold text-[#0d3d3a]">131</div>
            <div className="text-xs text-[#0d6b63] font-medium">
              92% of claims
            </div>
          </div>

          {/* 4. Avg Time to Review */}
          <div className="bg-white rounded-xl border border-[#e3ded4] p-5 shadow-sm space-y-2">
            <span className="text-[11px] font-bold text-[#889593] uppercase tracking-wider block">
              Avg. Time to Review
            </span>
            <div className="text-3xl font-bold text-[#0d3d3a]">2.4 days</div>
            <div className="text-xs text-[#166534] font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
              <span>0.6 days faster</span>
            </div>
          </div>
        </div>

        {/* MIDDLE CHARTS ROW (Page 12) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Refund claims per week Bar Chart (Col 7) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#e3ded4] p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#0d3d3a]">
                Refund claims per week
              </h3>
              <p className="text-xs text-[#6b7775]">Last 8 weeks, all services</p>
            </div>

            <div className="h-48 pt-6 flex items-end justify-between gap-3 border-b border-[#e3ded4] pb-2">
              {weeklyClaims.map((w) => {
                const heightPct = Math.round((w.count / maxWeekly) * 100);
                return (
                  <div key={w.week} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-bold text-[#0d6b63] opacity-0 group-hover:opacity-100 transition-opacity">
                      {w.count}
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[28px] rounded-t bg-[#0d6b63] hover:bg-[#0a534d] transition-all"
                    ></div>
                    <span className="text-[11px] font-semibold text-[#6b7775]">{w.week}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bookings by service (Col 5) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-[#e3ded4] p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#0d3d3a]">
                Bookings by service
              </h3>
              <p className="text-xs text-[#6b7775]">Total 1,284 bookings</p>
            </div>

            <div className="space-y-3 text-xs pt-1">
              {serviceData.map((s) => (
                <div key={s.service} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#0d3d3a]">{s.service}</span>
                    <span className="font-bold text-[#0d3d3a]">{s.bookings}</span>
                  </div>
                  <div className="w-full bg-[#f0ebe1] h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.round((s.bookings / 1284) * 100)}%` }}
                      className={`h-full ${s.barColor}`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM TABLES & BREAKDOWNS (Page 12) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Claims by Service Table (Col 6) */}
          <div className="lg:col-span-6 bg-white rounded-xl border border-[#e3ded4] p-5 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-[#0d3d3a]">
              Claims by service
            </h3>

            <div className="border border-[#e3ded4] rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#fbf9f4] border-b border-[#e3ded4] text-[#889593] font-bold text-[10px] uppercase">
                  <tr>
                    <th className="p-2.5">Service</th>
                    <th className="p-2.5">Bookings</th>
                    <th className="p-2.5">Claims</th>
                    <th className="p-2.5">Claim rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ebe1]">
                  {serviceData.map((row) => (
                    <tr key={row.service} className="hover:bg-[#fbf9f4]">
                      <td className="p-2.5 font-semibold text-[#0d3d3a]">{row.service}</td>
                      <td className="p-2.5 text-[#5c6967]">{row.bookings}</td>
                      <td className="p-2.5 font-bold text-[#0d3d3a]">{row.claims}</td>
                      <td className="p-2.5 text-[#0d6b63] font-semibold">{row.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Claim Reasons + Where claims are now (Col 6) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Claim reasons */}
            <div className="bg-white rounded-xl border border-[#e3ded4] p-5 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-[#0d3d3a]">
                Claim reasons
              </h3>

              <div className="space-y-2 text-xs">
                {claimReasons.map((cr) => (
                  <div
                    key={cr.reason}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#fbf9f4] border border-[#f0ebe1]"
                  >
                    <span className="font-medium text-[#0d3d3a]">{cr.reason}</span>
                    <span className="font-bold text-[#0d6b63]">{cr.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Where claims are now */}
            <div className="bg-white rounded-xl border border-[#e3ded4] p-5 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-[#0d3d3a]">
                Where claims are now
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {whereClaimsAreNow.map((w) => (
                  <div
                    key={w.stage}
                    className={`p-3 rounded-lg border border-[#e3ded4] ${w.color}`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
                      {w.stage}
                    </span>
                    <span className="text-xl font-bold mt-1 block">
                      {w.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footnote (Page 12) */}
        <div className="text-xs text-[#889593] pt-2 pb-6 border-t border-[#e3ded4]">
          Final refund decisions are made by providers. Figures are sample data for this design reference.
        </div>
      </main>
    </div>
  );
};
