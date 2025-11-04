"use client";

import { useEffect, useMemo, useState } from "react";

type WeightProfile = "under" | "normal" | "over";
type HabitLevel = "tot" | "trungbinh" | "chua_tot";
type Status = "pending" | "done" | "missed";

type CareInputs = {
  route: string;
  weight: WeightProfile;
  morningHabit: HabitLevel;
  eveningHabit: HabitLevel;
};

type DayTask = {
  dayIndex: number;
  title: string;
  detail: string;
  status: Status;
  updatedAt?: string;
};

type CarePlanState = {
  inputs: CareInputs;
  tasks: DayTask[];
  startDateISO: string;
  currentDayIndex: number;
  finished: boolean;
};

const STORAGE_KEY = "yhoa_care_plan_v1";

function getTodayYMD(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function diffDaysUTC(fromISO: string, toISO: string): number {
  const a = new Date(fromISO + "T00:00:00Z");
  const b = new Date(toISO + "T00:00:00Z");
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function buildTasks(inputs: CareInputs): DayTask[] {
  const base: string[] = [
    "Uống 1 cốc nước ấm sau khi thức dậy",
    "Hít thở sâu 5 phút điều hòa khí",
    "Xoa bóp ấn huyệt Bách hội, Hợp cốc nhẹ nhàng",
    "Đi bộ nhẹ 15 phút",
    "Bữa sáng ấm, tránh lạnh sống",
    "Uống nước ấm mỗi 2–3 giờ",
    "Tránh ngồi lâu, vận động 3 phút/giờ",
    "Xoa bóp vùng cổ vai gáy",
    "Bổ sung bữa trưa cân bằng",
    "Uống trà gừng/hoắc hương ấm (nếu phù hợp)",
    "Giãn cơ 10 phút buổi chiều",
    "Ăn tối sớm, vừa đủ",
    "Hạn chế màn hình trước ngủ 60 phút",
    "Ngâm chân nước ấm 10–15 phút",
    "Thở bụng 5 phút trước khi ngủ",
    "Ghi chú cảm nhận cơ thể",
    "Tập trung ăn, nhai kĩ",
    "Uống đủ nước cả ngày",
    "Tắm ấm, lau khô nhanh",
    "Giữ ấm vùng cổ – lưng",
    "Duy trì giờ ngủ cố định",
    "Ăn thêm rau, quả theo thể trạng",
    "Thả lỏng mắt 20-20-20",
    "Tự xoa bóp bàn chân",
    "Ôn lại 3 thói quen tốt nhất tuần",
    "Tập kéo giãn 5 phút sau khi làm việc",
    "Uống thêm 1 cốc nước ấm buổi chiều",
    "Đi cầu thang thay vì thang máy (khi phù hợp)",
    "Thiền hoặc thở chánh niệm 5 phút",
    "Dọn dẹp góc làm việc gọn gàng để ngủ ngon",
  ];

  return base.map((t, i) => {
    let title = t;
    if (inputs.weight === "over" && i === 3) title = "Đi bộ nhanh 20 phút";
    if (inputs.weight === "under" && i === 4) title = "Bữa sáng ấm, giàu đạm dễ tiêu";
    if (inputs.morningHabit === "chua_tot" && i === 1) title = "Hít thở 3 phút (bắt đầu nhẹ)";
    if (inputs.eveningHabit === "chua_tot" && i === 13) title = "Ngâm chân ấm 5–8 phút (khởi động)";
    return {
      dayIndex: i,
      title,
      detail: `${inputs.route} · Ngày ${i + 1}`,
      status: "pending" as Status,
    };
  });
}

function makeNewPlan(inputs: CareInputs): CarePlanState {
  const today = getTodayYMD();
  return {
    inputs,
    tasks: buildTasks(inputs),
    startDateISO: today,
    currentDayIndex: 0,
    finished: false,
  };
}

function loadPlan(): CarePlanState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CarePlanState) : null;
  } catch {
    return null;
  }
}

function savePlan(plan: CarePlanState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

export default function CarePlanPage() {
  const [plan, setPlan] = useState<CarePlanState | null>(null);
  const [inputs, setInputs] = useState<CareInputs>({
    route: "Điều hòa khí huyết",
    weight: "normal",
    morningHabit: "trungbinh",
    eveningHabit: "trungbinh",
  });

  useEffect(() => {
    const existing = loadPlan();
    if (existing) {
      const today = getTodayYMD();
      const daysPassed = diffDaysUTC(existing.startDateISO, today);
      let updated = { ...existing } as CarePlanState;
      if (daysPassed !== existing.currentDayIndex) {
        const maxIndex = Math.min(daysPassed, updated.tasks.length);
        updated.tasks = updated.tasks.map((t) => {
          if (t.dayIndex < maxIndex && t.status === "pending") {
            return { ...t, status: "missed" as Status, updatedAt: new Date().toISOString() };
          }
          return t;
        });
        updated.currentDayIndex = Math.min(daysPassed, updated.tasks.length - 1);
        if (daysPassed >= updated.tasks.length) {
          updated.finished = true;
          updated.currentDayIndex = updated.tasks.length - 1;
        }
      }
      setPlan(updated);
      savePlan(updated);
    }
  }, []);

  const todayTask = useMemo(() => {
    if (!plan) return null;
    if (plan.finished) return null;
    return plan.tasks[plan.currentDayIndex] ?? null;
  }, [plan]);

  function handleStartPlan() {
    const newPlan = makeNewPlan(inputs);
    setPlan(newPlan);
    savePlan(newPlan);
  }

  function setAndStore(next: CarePlanState) {
    setPlan(next);
    savePlan(next);
  }

  function completeToday() {
    if (!plan || plan.finished) return;
    const idx = plan.currentDayIndex;
    const tasks = plan.tasks.map((t) =>
      t.dayIndex === idx ? { ...t, status: "done" as Status, updatedAt: new Date().toISOString() } : t
    );
    const nextIndex = idx + 1;
    const finished = nextIndex >= tasks.length;
    const next: CarePlanState = {
      ...plan,
      tasks,
      currentDayIndex: Math.min(nextIndex, tasks.length - 1),
      finished,
    };
    setAndStore(next);
  }

  function skipToday() {
    if (!plan || plan.finished) return;
    const idx = plan.currentDayIndex;
    const tasks = plan.tasks.map((t) =>
      t.dayIndex === idx ? { ...t, status: "missed" as Status, updatedAt: new Date().toISOString() } : t
    );
    const nextIndex = idx + 1;
    const finished = nextIndex >= tasks.length;
    const next: CarePlanState = {
      ...plan,
      tasks,
      currentDayIndex: Math.min(nextIndex, tasks.length - 1),
      finished,
    };
    setAndStore(next);
  }

  function resetAll() {
    setPlan(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  const completion = useMemo(() => {
    if (!plan) return { done: 0, missed: 0, total: 30, percent: 0 };
    const done = plan.tasks.filter((t) => t.status === "done").length;
    const missed = plan.tasks.filter((t) => t.status === "missed").length;
    const total = plan.tasks.length;
    const percent = Math.round((done / total) * 100);
    return { done, missed, total, percent };
  }, [plan]);

  function evaluationText(percent: number): string {
    if (percent >= 85) return "Rất tốt! Bạn duy trì thói quen mạnh mẽ, sức khỏe cải thiện rõ rệt.";
    if (percent >= 60) return "Khá! Nền tảng thói quen đã hình thành, hãy giữ nhịp để cải thiện thêm.";
    if (percent >= 40) return "Ổn! Bạn đã bắt đầu, cần đều đặn hơn để thấy hiệu quả rõ hơn.";
    return "Cần cải thiện. Hãy bắt đầu lại với mục tiêu nhỏ, tăng dần từng ngày.";
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Full-screen ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[420px] w-[110vw] -translate-x-1/2 rounded-full blur-3xl" style={{ background: "radial-gradient(closest-side,#6E59CF 0%, transparent 60%)" }} />
        <div className="absolute -bottom-24 right-[-120px] h-[420px] w-[420px] rounded-full blur-3xl" style={{ background: "radial-gradient(closest-side,#22d3ee 0%, transparent 60%)" }} />
      </div>
      {/* Header */}
      <header className="mx-auto max-w-7xl px-6 pt-12">
        <div className="flex items-center gap-3">
          <div className="w-1 h-12 bg-gradient-to-b from-violet-500 to-cyan-500 rounded-full"></div>
          <div>
            <h1 className="inline-block pr-3 text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-violet-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">Khỏe cùng Y HOA</h1>
            <p className="text-white/60 text-lg">Lộ trình 30 ngày nuôi dưỡng thói quen lành mạnh theo YHCT</p>
          </div>
        </div>
      </header>

      {/* Main content: balanced full-width container */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left column: onboarding or today card */}
          <div className="md:col-span-1 w-full">
            {!plan && (
              <div className="glass glow rounded-3xl p-6 md:p-8 text-white">
                <h2 className="text-xl md:text-2xl font-bold">Bắt đầu lộ trình</h2>
                <div className="mt-6 grid gap-6">
                  <div>
                    <label className="block text-sm text-white/80 mb-2">Chọn lộ trình theo YHCT</label>
                    <select
                      className="select-future"
                      value={inputs.route}
                      onChange={(e) => setInputs((s) => ({ ...s, route: e.target.value }))}
                    >
                      <option value="Điều hòa khí huyết">Điều hòa khí huyết</option>
                      <option value="Kiện tỳ hóa thấp">Kiện tỳ hóa thấp</option>
                      <option value="Dưỡng âm thanh nhiệt">Dưỡng âm thanh nhiệt</option>
                      <option value="An thần dưỡng tâm">An thần dưỡng tâm</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-white/80 mb-2">Mốc 1: Cân nặng</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { v: "under", label: "Thiếu cân" },
                        { v: "normal", label: "Bình thường" },
                        { v: "over", label: "Thừa cân" },
                      ].map((o) => (
                        <button
                          key={o.v}
                          className={`btn-choice text-sm ${
                            inputs.weight === (o.v as WeightProfile)
                              ? "btn-choice-active"
                              : ""
                          }`}
                          onClick={() => setInputs((s) => ({ ...s, weight: o.v as WeightProfile }))}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/80 mb-2">Mốc 2: Thói quen buổi sáng</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { v: "tot", label: "Tốt" },
                        { v: "trungbinh", label: "TB" },
                        { v: "chua_tot", label: "Chưa tốt" },
                      ].map((o) => (
                        <button
                          key={o.v}
                          className={`btn-choice text-sm ${
                            inputs.morningHabit === (o.v as HabitLevel)
                              ? "btn-choice-active"
                              : ""
                          }`}
                          onClick={() => setInputs((s) => ({ ...s, morningHabit: o.v as HabitLevel }))}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/80 mb-2">Mốc 3: Thói quen buổi tối</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { v: "tot", label: "Tốt" },
                        { v: "trungbinh", label: "TB" },
                        { v: "chua_tot", label: "Chưa tốt" },
                      ].map((o) => (
                        <button
                          key={o.v}
                          className={`btn-choice text-sm ${
                            inputs.eveningHabit === (o.v as HabitLevel)
                              ? "btn-choice-active"
                              : ""
                          }`}
                          onClick={() => setInputs((s) => ({ ...s, eveningHabit: o.v as HabitLevel }))}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button className="mt-2 inline-flex items-center justify-center btn-cta-main px-5 py-2.5 text-sm w-full" onClick={handleStartPlan}>
                    Tạo lộ trình 30 ngày
                  </button>
                </div>
              </div>
            )}

            {plan && !plan.finished && (
              <div className="glass glow rounded-3xl p-6 md:p-8 text-white">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl md:text-2xl font-bold">Ngày {plan.currentDayIndex + 1} / {plan.tasks.length}</h2>
                  <button className="text-xs text-white/60 underline" onClick={resetAll}>Đặt lại</button>
                </div>
                <div className="mt-2 text-white/80 text-sm">Lộ trình: {plan.inputs.route}</div>

                {todayTask && (
                  <div className="mt-5 glass rounded-2xl p-5">
                    <div className="text-white/90 font-semibold">{todayTask.title}</div>
                    <div className="mt-1 text-sm text-white/70">{todayTask.detail}</div>
                    <div className="mt-4 flex items-center gap-3">
                      <button className="btn-cta-main px-4 py-2 text-sm" onClick={completeToday}>✓ Đã hoàn thành hôm nay</button>
                      <button className="btn-cta-secondary px-4 py-2 text-sm" onClick={skipToday}>Không làm hôm nay</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {plan && plan.finished && (
              <div className="glass glow rounded-3xl p-6 md:p-8 text-white">
                <h2 className="text-xl md:text-2xl font-bold">Hoàn thành lộ trình</h2>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="glass rounded-2xl p-4 text-center">
                    <div className="text-3xl font-extrabold text-emerald-400">{completion.percent}%</div>
                    <div className="mt-1 text-xs text-white/70">Tỉ lệ hoàn thành</div>
                  </div>
                  <div className="glass rounded-2xl p-4 text-center">
                    <div className="text-xl font-bold">{completion.done}</div>
                    <div className="mt-1 text-xs text-white/70">Nhiệm vụ hoàn thành</div>
                  </div>
                  <div className="glass rounded-2xl p-4 text-center">
                    <div className="text-xl font-bold">{completion.missed}</div>
                    <div className="mt-1 text-xs text-white/70">Nhiệm vụ bỏ lỡ</div>
                  </div>
                </div>
                <div className="mt-6 glass rounded-2xl p-5 text-white/90">{evaluationText(completion.percent)}</div>
                <div className="mt-6 flex gap-3">
                  <button className="btn-cta-secondary px-4 py-2 text-sm" onClick={resetAll}>Bắt đầu lại lộ trình mới</button>
                </div>
              </div>
            )}
          </div>

          {/* Right column: progress (sticky) */}
          <div className="md:col-span-1 w-full">
            {plan && (
              <div className="md:sticky md:top-24 space-y-4">
                <div className="glass glow rounded-3xl p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-white/80">Tiến độ</div>
                    <div className="text-xs text-white/60">{completion.percent}%</div>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#6E59CF] to-[#22d3ee]" style={{ width: `${completion.percent}%` }} />
                  </div>
                </div>
                <div className="glass glow rounded-3xl p-6 text-white">
                  <div className="grid grid-cols-5 gap-2">
                    {plan.tasks.map((t) => (
                      <div key={t.dayIndex} className="rounded-lg border border-white/10 bg-white/5 p-2 text-center text-xs hover:border-white/20 transition">
                        <div>Ngày {t.dayIndex + 1}</div>
                        <div className={`mt-1 font-semibold ${
                          t.status === "done"
                            ? "text-emerald-400"
                            : t.status === "missed"
                            ? "text-rose-400"
                            : "text-white/70"
                        }`}>
                          {t.status === "done" ? "Hoàn thành" : t.status === "missed" ? "Bỏ lỡ" : "Chờ"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}


