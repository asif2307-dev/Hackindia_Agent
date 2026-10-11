import React, { useState } from 'react';
import { useInvestigation } from '../context/InvestigationContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useInvestigation();

  const [activeSection, setActiveSection] = useState('general');
  const [orgName, setOrgName] = useState(settings.orgName);
  const [currency, setCurrency] = useState(settings.currency);
  const [timezone, setTimezone] = useState(settings.timezone);
  const [dateFormat, setDateFormat] = useState(settings.dateFormat);

  const [policies, setPolicies] = useState(settings.policies);
  const [riskRules, setRiskRules] = useState(settings.riskRules);
  const [notifications, setNotifications] = useState(settings.notifications);
  const [aiPreferences, setAiPreferences] = useState(settings.aiPreferences);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateSettings({
        orgName,
        currency,
        timezone,
        dateFormat,
        policies,
        riskRules,
        notifications,
        aiPreferences,
      });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 700);
  };

  const navItems = [
    { id: 'general', label: 'General', icon: 'tune' },
    { id: 'refund-policies', label: 'Refund Policies', icon: 'balance', tag: '5 Rules' },
    { id: 'risk-rules', label: 'Risk & Human Review', icon: 'verified_user', dot: true },
    { id: 'notifications', label: 'Notifications', icon: 'notifications_active' },
    { id: 'ai-preferences', label: 'AI Preferences', icon: 'smart_toy' },
  ];

  return (
    <div className="flex flex-col w-full pb-20 text-left">
      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-gradient-to-r from-[#0d283e] via-[#006D77] to-[#0a1e2e] text-white font-bold shadow-2xl flex items-center gap-3 animate-fade-in border border-[#20B8B0]/40">
          <span className="material-symbols-outlined text-[22px] text-[#E8B86D]">task_alt</span>
          <span>Platform settings updated and logged to audit ledger!</span>
        </div>
      )}

      {/* Header & Breadcrumbs Area */}
      <div className="relative flex flex-col gap-1 pb-4 mb-2">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold tracking-wider uppercase">
          <span>System</span>
          <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_right</span>
          <span className="text-[#006D77] font-bold">Platform Settings</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-1">
          <div>
            <h1 className="text-2xl sm:text-3xl text-[#17324D] tracking-tight font-extrabold font-['Plus_Jakarta_Sans']">
              Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              Configure refund investigation policies, risk thresholds, human review rules, and platform preferences.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#EAF8F7] px-3.5 py-1.5 rounded-full shrink-0 border border-[#20B8B0]/30 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#20B8B0] animate-pulse"></span>
            <span className="text-xs text-[#006D77] font-bold">Refund Policies: Active</span>
          </div>
        </div>
      </div>

      {/* Main Asymmetric Settings Cockpit */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sub-navigation Rail (Sticky Column) */}
        <nav className="lg:col-span-3 sticky top-20 flex flex-col gap-1.5 bg-white p-3.5 rounded-2xl shadow-sm border border-[#C2EAE7]/70">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 px-3 pb-1 font-bold">
            Preferences
          </p>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection(item.id);
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#006D77] to-[#20B8B0] text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-[#EAF8F7] hover:text-[#006D77]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-white' : 'text-[#006D77]'}`}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.tag && <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{item.tag}</span>}
                {item.dot && <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#E8B86D]' : 'bg-[#006D77]'}`}></span>}
                {isActive && !item.tag && !item.dot && (
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Detailed Content Columns */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          {/* SECTION 1: General Settings */}
          <section
            id="general"
            className="p-5 sm:p-6 rounded-2xl bg-white shadow-sm border border-[#C2EAE7]/70 flex flex-col gap-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006D77] text-[22px]">tune</span>
                  <h2 className="text-base sm:text-lg font-bold text-[#17324D] tracking-tight">
                    General Settings
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage platform localization, reporting formats, and regional operating parameters.
                </p>
              </div>
              <button
                onClick={handleSave}
                className="self-start sm:self-auto px-4 py-2 rounded-full bg-gradient-to-r from-[#006D77] to-[#20B8B0] hover:from-[#005a63] hover:to-[#1aa39b] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                <span>Save Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Field: Org Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#17324D] flex items-center justify-between" htmlFor="org-name">
                  <span>Organization Name</span>
                  <span className="text-[11px] text-[#006D77] font-semibold bg-[#EAF8F7] px-2 py-0.5 rounded">Verified Tenant</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                    apartment
                  </span>
                  <input
                    id="org-name"
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#f8fbfa] text-xs sm:text-sm text-[#17324D] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#20B8B0]/30 focus:border-[#006D77] border border-slate-200 transition-all"
                  />
                </div>
              </div>

              {/* Field: Default Currency */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#17324D]" htmlFor="currency-select">
                  Default Currency
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                    currency_rupee
                  </span>
                  <select
                    id="currency-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full h-11 pl-10 pr-9 rounded-xl bg-[#f8fbfa] text-xs sm:text-sm text-[#17324D] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#20B8B0]/30 focus:border-[#006D77] appearance-none border border-slate-200 transition-all cursor-pointer"
                  >
                    <option>INR (₹) - Indian Rupee</option>
                    <option>USD ($) - US Dollar</option>
                    <option>EUR (€) - Euro</option>
                    <option>GBP (£) - British Pound</option>
                    <option>SGD (S$) - Singapore Dollar</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Field: Investigation Timezone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#17324D]" htmlFor="timezone-select">
                  Investigation Timezone
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                    schedule
                  </span>
                  <select
                    id="timezone-select"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full h-11 pl-10 pr-9 rounded-xl bg-[#f8fbfa] text-xs sm:text-sm text-[#17324D] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#20B8B0]/30 focus:border-[#006D77] appearance-none border border-slate-200 transition-all cursor-pointer"
                  >
                    <option>Asia/Kolkata (IST, UTC+05:30)</option>
                    <option>UTC (Coordinated Universal Time)</option>
                    <option>Europe/London (BST, UTC+01:00)</option>
                    <option>America/New_York (EST, UTC-05:00)</option>
                    <option>Asia/Singapore (SGT, UTC+08:00)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Field: Date Format */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#17324D]" htmlFor="date-format-select">
                  Date Format
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                    calendar_today
                  </span>
                  <select
                    id="date-format-select"
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full h-11 pl-10 pr-9 rounded-xl bg-[#f8fbfa] text-xs sm:text-sm text-[#17324D] font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#20B8B0]/30 focus:border-[#006D77] appearance-none border border-slate-200 transition-all cursor-pointer"
                  >
                    <option>DD MMM YYYY (e.g., 24 Oct 2026)</option>
                    <option>YYYY-MM-DD (ISO 8601)</option>
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Refund Investigation Policies */}
          <section
            id="refund-policies"
            className="p-5 sm:p-6 rounded-2xl bg-white shadow-sm border border-[#C2EAE7]/70 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006D77] text-[22px]">balance</span>
                <h2 className="text-base sm:text-lg font-bold text-[#17324D] tracking-tight">
                  Refund Policies
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Configure refund investigation policies and evidence checks.
              </p>
            </div>

            {/* Policy Items Stack */}
            <div className="flex flex-col gap-3">
              {/* Item 1 */}
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 flex items-start justify-between gap-4 transition-colors hover:border-[#20B8B0] hover:bg-white shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#006D77] shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[20px]">currency_exchange</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-[#17324D]">
                      Full Refund Recommendation
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Allows AI to recommend a full refund when the applicable policy supports it.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={policies.fullRefund}
                    onChange={(e) => setPolicies({ ...policies, fullRefund: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#006D77] peer-checked:to-[#20B8B0] shadow-inner"></div>
                </label>
              </div>

              {/* Item 2 */}
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 flex items-start justify-between gap-4 transition-colors hover:border-[#20B8B0] hover:bg-white shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#006D77] shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[20px]">pie_chart</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-[#17324D]">
                      Partial Refund Recommendation
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Evaluates sector disruptions, non-refundable taxes, and pro-rated fare segments.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={policies.partialRefund}
                    onChange={(e) => setPolicies({ ...policies, partialRefund: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#006D77] peer-checked:to-[#20B8B0] shadow-inner"></div>
                </label>
              </div>

              {/* Item 3 */}
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 flex items-start justify-between gap-4 transition-colors hover:border-[#20B8B0] hover:bg-white shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#006D77] shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[20px]">rule_folder</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-[#17324D]">
                      Policy Evidence Required
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Checks the applicable refund policy before making a recommendation.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={policies.policyEvidenceRequired}
                    onChange={(e) => setPolicies({ ...policies, policyEvidenceRequired: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#006D77] peer-checked:to-[#20B8B0] shadow-inner"></div>
                </label>
              </div>

              {/* Item 4 */}
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 flex items-start justify-between gap-4 transition-colors hover:border-[#20B8B0] hover:bg-white shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#006D77] shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[20px]">manage_history</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-[#17324D]">
                      Customer History Check
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Checks customer history for relevant refund and dispute patterns.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={policies.customerHistoryCheck}
                    onChange={(e) => setPolicies({ ...policies, customerHistoryCheck: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#006D77] peer-checked:to-[#20B8B0] shadow-inner"></div>
                </label>
              </div>

              {/* Item 5 */}
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 flex items-start justify-between gap-4 transition-colors hover:border-[#20B8B0] hover:bg-white shadow-2xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#006D77] shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[20px]">flight_takeoff</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-bold text-[#17324D]">
                      Cancellation Evidence Check
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Checks booking and cancellation evidence.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={policies.cancellationEvidenceCheck}
                    onChange={(e) => setPolicies({ ...policies, cancellationEvidenceCheck: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#006D77] peer-checked:to-[#20B8B0] shadow-inner"></div>
                </label>
              </div>
            </div>

            {/* Banner */}
            <div className="p-4 rounded-xl bg-[#EAF8F7] border border-[#20B8B0]/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#006D77]/10 flex items-center justify-center text-[#006D77] shrink-0">
                <span className="material-symbols-outlined text-[18px]">info</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                AI uses these policies as investigation inputs. Final refund decisions remain subject to human approval when required.
              </p>
            </div>
          </section>

          {/* SECTION 3: Risk & Human Review Rules */}
          <section
            id="risk-rules"
            className="p-5 sm:p-6 rounded-2xl bg-white shadow-sm border border-[#C2EAE7]/70 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006D77] text-[22px]">security</span>
                <h2 className="text-base sm:text-lg font-bold text-[#17324D] tracking-tight">
                  Risk & Human Review Rules
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Automated thresholds and guardrails triggering required human auditor intervention.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Threshold Slider Card */}
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 flex flex-col gap-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#17324D]">
                      High Risk Threshold
                    </span>
                    <p className="text-xs text-slate-500">
                      Scale 0–100 anomaly benchmark score. Investigations exceeding this trigger immediate triage locks.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white shadow-xs border border-slate-200">
                    <span className="text-base font-extrabold text-[#006D77]">
                      {riskRules.highRiskThreshold}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">/ 100</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400 font-mono font-bold">0</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={riskRules.highRiskThreshold}
                    onChange={(e) =>
                      setRiskRules({ ...riskRules, highRiskThreshold: parseInt(e.target.value, 10) })
                    }
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#006D77]"
                  />
                  <span className="text-xs text-slate-400 font-mono font-bold">100</span>
                </div>
              </div>

              {/* Human Review Required Toggle */}
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 flex items-center justify-between gap-4 shadow-2xs">
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-[#17324D]">
                    Human Review Required
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Directs cases exceeding risk thresholds into auditor triage queue.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={riskRules.humanReviewRequired}
                    onChange={(e) => setRiskRules({ ...riskRules, humanReviewRequired: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#006D77] peer-checked:to-[#20B8B0] shadow-inner"></div>
                </label>
              </div>

              {/* High-Value Refund Review */}
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <div className="flex flex-col max-w-lg">
                  <span className="text-xs sm:text-sm font-bold text-[#17324D]">
                    High-Value Refund Review
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Any refund recommendation at or exceeding this threshold requires manual sign-off.
                  </p>
                </div>
                <div className="relative w-full sm:w-44 shrink-0">
                  <span className="text-xs sm:text-sm text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 font-bold">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={riskRules.highValueThreshold.toLocaleString('en-IN')}
                    onChange={(e) => {
                      const num = parseInt(e.target.value.replace(/,/g, ''), 10) || 0;
                      setRiskRules({ ...riskRules, highValueThreshold: num });
                    }}
                    className="w-full h-10 pl-7 pr-3 rounded-xl bg-white text-xs sm:text-sm font-bold text-[#17324D] focus:outline-none focus:ring-2 focus:ring-[#20B8B0]/30 focus:border-[#006D77] shadow-xs border border-slate-200 text-right"
                  />
                </div>
              </div>

              {/* Insufficient Evidence Review */}
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 flex items-center justify-between gap-4 shadow-2xs">
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-[#17324D]">
                    Insufficient Evidence Review
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Automatically escalates investigations missing carrier or payment verification data.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={riskRules.insufficientEvidenceReview}
                    onChange={(e) => setRiskRules({ ...riskRules, insufficientEvidenceReview: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#006D77] peer-checked:to-[#20B8B0] shadow-inner"></div>
                </label>
              </div>

              {/* Account or Payment Risk Review */}
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 flex items-center justify-between gap-4 shadow-2xs">
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-[#17324D]">
                    Account or Payment Risk Review
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Flags mismatched settlement accounts or third-party corporate cards.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={riskRules.paymentRiskReview}
                    onChange={(e) => setRiskRules({ ...riskRules, paymentRiskReview: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#006D77] peer-checked:to-[#20B8B0] shadow-inner"></div>
                </label>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#EAF8F7] border border-[#20B8B0]/30 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#006D77] text-[18px]">verified</span>
              <span className="text-xs text-slate-700 font-medium">
                Risk signals guide investigation and review. High risk does not automatically mean fraud.
              </span>
            </div>
          </section>

          {/* SECTION 4: Notifications */}
          <section
            id="notifications"
            className="p-5 sm:p-6 rounded-2xl bg-white shadow-sm border border-[#C2EAE7]/70 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006D77] text-[22px]">notifications</span>
                <h2 className="text-base sm:text-lg font-bold text-[#17324D] tracking-tight">
                  Notifications
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Configure auditor alerts and escalation dispatch channels.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 flex flex-col justify-between gap-3 shadow-2xs hover:border-[#20B8B0] hover:bg-white transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006D77] text-[20px]">assignment_late</span>
                    <span className="text-xs sm:text-sm font-bold text-[#17324D]">New Human Review</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={notifications.newHumanReview}
                      onChange={(e) => setNotifications({ ...notifications, newHumanReview: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#006D77] peer-checked:to-[#20B8B0]"></div>
                  </label>
                </div>
                <p className="text-xs text-slate-500">
                  Immediate dispatch to lead auditors whenever manual triage is locked.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 flex flex-col justify-between gap-3 shadow-2xs hover:border-[#20B8B0] hover:bg-white transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-rose-600 text-[20px]">warning</span>
                    <span className="text-xs sm:text-sm font-bold text-[#17324D]">High-Risk Detected</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={notifications.highRiskDetected}
                      onChange={(e) => setNotifications({ ...notifications, highRiskDetected: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#006D77] peer-checked:to-[#20B8B0]"></div>
                  </label>
                </div>
                <p className="text-xs text-slate-500">
                  Priority alert triggered for travel claims scoring ≥ 70 on risk index.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 flex flex-col justify-between gap-3 shadow-2xs hover:border-[#20B8B0] hover:bg-white transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006D77] text-[20px]">fact_check</span>
                    <span className="text-xs sm:text-sm font-bold text-[#17324D]">Investigation Completed</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={notifications.investigationCompleted}
                      onChange={(e) => setNotifications({ ...notifications, investigationCompleted: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#006D77] peer-checked:to-[#20B8B0]"></div>
                  </label>
                </div>
                <p className="text-xs text-slate-500">
                  Daily summary digest aggregating automatically resolved refund records.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 flex flex-col justify-between gap-3 shadow-2xs hover:border-[#20B8B0] hover:bg-white transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006D77] text-[20px]">sync_alt</span>
                    <span className="text-xs sm:text-sm font-bold text-[#17324D]">Refund Decision Updated</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={notifications.refundDecisionUpdated}
                      onChange={(e) => setNotifications({ ...notifications, refundDecisionUpdated: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#006D77] peer-checked:to-[#20B8B0]"></div>
                  </label>
                </div>
                <p className="text-xs text-slate-500">
                  Instant webhook notifications upon senior auditor sign-off or carrier rejection.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 5: AI Investigation Preferences */}
          <section
            id="ai-preferences"
            className="p-5 sm:p-6 rounded-2xl bg-white shadow-sm border border-[#C2EAE7]/70 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006D77] text-[22px]">smart_toy</span>
                <h2 className="text-base sm:text-lg font-bold text-[#17324D] tracking-tight">
                  AI Investigation Preferences
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Core intelligence and explainability configuration for the refund engine.
              </p>
            </div>

            {/* Signature Oceanic Card - Engine Status Pill */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0d283e] via-[#006D77] to-[#0a1e2e] text-white flex items-center justify-between shadow-md border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#20B8B0] border border-white/10">
                  <span className="material-symbols-outlined text-[22px]">psychology</span>
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
                    Agent Travel Autonomous Engine
                  </span>
                  <p className="text-xs text-white/70">
                    Zero-loss carrier telemetry reconciler active
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#E8B86D] text-[#0d283e] text-[11px] font-black uppercase tracking-wider shadow-xs">
                Nominal
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Toggle 1 */}
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 flex items-center justify-between gap-4 shadow-2xs hover:border-[#20B8B0] hover:bg-white transition-all">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#006D77] text-[20px]">neurology</span>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#17324D]">AI Investigation</span>
                    <p className="text-xs text-slate-500">
                      Autonomous multi-agent parsing of airline PNRs and ticket coupon history.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={aiPreferences.aiInvestigation}
                    onChange={(e) => setAiPreferences({ ...aiPreferences, aiInvestigation: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#006D77] peer-checked:to-[#20B8B0] shadow-inner"></div>
                </label>
              </div>

              {/* Toggle 2 */}
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 flex items-center justify-between gap-4 shadow-2xs hover:border-[#20B8B0] hover:bg-white transition-all">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#006D77] text-[20px]">insights</span>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#17324D]">AI Recommendations</span>
                    <p className="text-xs text-slate-500">
                      Auto-computes suggested monetary payout based on fare class and disruption cause.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={aiPreferences.aiRecommendations}
                    onChange={(e) => setAiPreferences({ ...aiPreferences, aiRecommendations: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#006D77] peer-checked:to-[#20B8B0] shadow-inner"></div>
                </label>
              </div>

              {/* Toggle 3 */}
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 flex items-center justify-between gap-4 shadow-2xs hover:border-[#20B8B0] hover:bg-white transition-all">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#006D77] text-[20px]">description</span>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#17324D]">Evidence-Based Reasoning</span>
                    <p className="text-xs text-slate-500">
                      Generates human-readable citation trees linked to DGCA & EU261 regulatory clauses.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={aiPreferences.evidenceBasedReasoning}
                    onChange={(e) => setAiPreferences({ ...aiPreferences, evidenceBasedReasoning: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#006D77] peer-checked:to-[#20B8B0] shadow-inner"></div>
                </label>
              </div>

              {/* Toggle 4 */}
              <div className="p-4 rounded-xl bg-[#f8fbfa] border border-[#C2EAE7]/70 flex items-center justify-between gap-4 shadow-2xs hover:border-[#20B8B0] hover:bg-white transition-all">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#006D77] text-[20px]">verified</span>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#17324D]">
                      Human Approval for Significant Refunds
                    </span>
                    <p className="text-xs text-slate-500">
                      Forces supervisor electronic signature before any ledger adjustment executes.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={aiPreferences.humanApprovalSignificant}
                    onChange={(e) => setAiPreferences({ ...aiPreferences, humanApprovalSignificant: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#006D77] peer-checked:to-[#20B8B0] shadow-inner"></div>
                </label>
              </div>
            </div>

            {/* Note */}
            <div className="p-4 rounded-xl bg-[#FEF7EA] border border-[#E8B86D]/40 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#B87A1E] text-[22px] shrink-0 mt-0.5">shield</span>
              <div className="flex flex-col text-[#8A5816]">
                <span className="text-xs font-bold">Governance Guarantee</span>
                <p className="text-xs mt-0.5 leading-relaxed">
                  AI investigates evidence and recommends actions. It does not make irreversible financial decisions on its own.
                </p>
              </div>
            </div>
          </section>

          {/* Bottom Page Actions (Sticky Bar) */}
          <div className="sticky bottom-6 z-30 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-[#C2EAE7]/70 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-500">
              <span className="material-symbols-outlined text-[#006D77] text-[18px]">lock_reset</span>
              <span className="text-xs">
                All changes logged to platform audit ledger.
              </span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  setOrgName(settings.orgName);
                  setCurrency(settings.currency);
                  setPolicies(settings.policies);
                  setRiskRules(settings.riskRules);
                }}
                className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#006D77] to-[#20B8B0] hover:from-[#005a63] hover:to-[#1aa39b] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                type="button"
              >
                {isSaving ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                    <span>Applying to Ledger...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
