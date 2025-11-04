"use client";

import { useEffect, useMemo, useState } from "react";
import FallbackImage from "@/components/ui/FallbackImage";
import YinYangLoader from "@/components/ui/YinYangLoader";
import AcupointCard from "@/components/ui/AcupointCard";

type Msg = { role: "user" | "assistant"; content: string; data?: any };
type HistoryItem = { at: number; input: string; response: any };

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Chào bạn! Tôi có thể giúp gì cho sức khỏe của bạn hôm nay?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("yhct_history");
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("yhct_history", JSON.stringify(history));
    } catch {}
  }, [history]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setLoading(true);
    // Chuẩn bị ngữ cảnh hội thoại để gửi lên API
    const contextMsgs = [...messages, { role: "user", content: text }];
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    try {
      const res = await fetch("/api/yhct/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, messages: contextMsgs }),
      });
      const json = await res.json();
      const herbList: any[] = json?.giaiPhap?.herbs || [];
      const content = json?.mode === "lookup"
        ? (() => {
            const name = json?.lookup?.type === "herb" ? (json?.lookup?.herb?.ten || "—") : (json?.lookup?.acupoint?.name || "—");
            return `Chào bạn. Đây là thông tin tra cứu về ${name} theo YHCT.`;
          })()
        : "Tôi đã rõ về triệu chứng của bạn. Đây là phân tích theo YHCT và gợi ý hỗ trợ.";

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content,
          data: {
            response: json,
            herbs: herbList,
            disclaimer: json?.disclaimer,
          },
        },
      ]);

      setHistory((h) => [...h, { at: Date.now(), input: text, response: json }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Xin lỗi, có lỗi khi xử lý. Vui lòng thử lại sau.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative mx-auto max-w-4xl px-6 py-12">
      {/* Futuristic glow background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>
      <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl px-6 py-10 text-white shadow-[0_0_60px_-20px_rgba(167,139,250,0.35)]">
        <div className="mb-8">
          <h1 className="inline-block pr-3 text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-violet-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Trợ lí ảo Y HOA
          </h1>
          <p className="mt-2 text-white/60 text-sm">
            Trợ lí phân tích triệu chứng theo Y học Cổ truyền.
          </p>
        </div>

        {/* Thanh hành động */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => setHistoryOpen((v) => !v)}
            className="px-3 py-2 rounded-lg text-xs border border-purple-400/30 bg-purple-500/10 text-purple-200 hover:border-purple-400/50 hover:bg-purple-500/20 transition-all"
          >
            {historyOpen ? "Ẩn lịch sử" : "Xem lịch sử"}
          </button>
          {loading ? (
            <div className="flex items-center gap-2 text-white/70 text-xs">
              <YinYangLoader className="w-5 h-5" />
              <span>Đang phân tích theo YHCT...</span>
            </div>
          ) : null}
        </div>

        {/* Lịch sử */}
        {historyOpen ? (
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-sm">Lịch sử tư vấn</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `yhct_history_${Date.now()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3 py-2 rounded-lg text-xs border border-white/15 bg-white/5 hover:bg-white/10 transition-all"
                >
                  Xuất JSON
                </button>
                <button
                  onClick={() => setHistory([])}
                  className="px-3 py-2 rounded-lg text-xs border border-white/15 bg-white/5 hover:bg-white/10 transition-all"
                >
                  Xóa tất cả
                </button>
              </div>
            </div>
            <div className="mt-3 space-y-2 max-h-60 overflow-auto">
              {history.length === 0 ? (
                <div className="text-xs text-white/60">Chưa có mục nào.</div>
              ) : (
                history
                  .slice()
                  .reverse()
                  .map((h, i) => (
                    <div key={i} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 hover:bg-white/5 transition-all cursor-pointer">
                      <div className="text-xs text-purple-300/70">{new Date(h.at).toLocaleString()}</div>
                      <div className="text-sm text-white/90 mt-1">{h.input}</div>
                    </div>
                  ))
              )}
            </div>
          </div>
        ) : null}

        {/* Khung hội thoại */}
        <div className="space-y-4 mb-6 max-h-[600px] overflow-y-auto scrollbar-hide pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border px-4 py-3 shadow-lg transition-all ${
                m.role === "user" 
                  ? "border-purple-400/40 bg-gradient-to-br from-purple-500/20 to-cyan-500/10 ml-8" 
                  : "border-white/15 bg-white/[0.03] mr-8"
              }`}
            >
              {/* Role chip + tiny orb avatar */}
              <div className="mb-1 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] tracking-wide uppercase ${
                  m.role === 'assistant' ? 'bg-purple-500/15 text-purple-200 border border-purple-400/30' : 'bg-cyan-500/15 text-cyan-200 border border-cyan-400/30'
                }`}>{m.role === 'assistant' ? 'Assistant' : 'You'}</span>
                {m.role === 'assistant' ? (
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 shadow-[0_0_12px_2px_rgba(99,102,241,0.6)]" />
                ) : null}
              </div>
              <div className="text-sm whitespace-pre-line leading-relaxed">{m.content}</div>

              {/* Một khối phản hồi duy nhất: gọn gàng & tử tế */}
              {m.role === "assistant" && m.data?.response ? (
                <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  {(() => {
                    const resp = m.data.response;
                    const patternName: string = resp?.chanChung || "chưa rõ";
                  const etiology: string = resp?.bienChung || "—";
                  const acupoints: any[] = resp?.giaiPhap?.acupoints || [];
                  const nutrition: any = resp?.giaiPhap?.nutrition || { shouldEat: [], avoid: [], principles: [] };
                  const herbs: any[] = m.data.herbs || [];
                  const questions: string[] = resp?.probingQuestions || [];
                  const warnings: string[] = resp?.canhBao || [];
                  const phuongPhap: string[] = resp?.phuongPhap || [];
                  const dinhHuong: string = resp?.lyLuan?.dinhHuongTri || "";
                  const nguHanh: string = resp?.lyLuan?.nguHanh || "";
                  const dieuChinhMoiTruong: string[] = resp?.lyLuan?.moiTruong || [];
                  const dauHieuNguyHiem: string[] = resp?.lyLuan?.dangerSigns || [];

                    const exportCsv = () => {
                      const rows: string[][] = [];
                      rows.push(["Chẩn chứng", patternName]);
                      rows.push(["Biện chứng", etiology]);
                      rows.push(["Định hướng trị", dinhHuong]);
                      rows.push(["Phương pháp", phuongPhap.join(" | ")]);
                      rows.push(["Ngũ Hành", nguHanh]);
                      rows.push(["Bấm huyệt", acupoints.map((p) => `${p.name}: ${p.principle || p.desc || ""}`).join(" | ")]);
                      rows.push(["Nên dùng", (nutrition.shouldEat || []).join(", ")]);
                      rows.push(["Tránh", (nutrition.avoid || []).join(", ")]);
                      rows.push(["Nguyên tắc", (nutrition.principles || []).join(", ")]);
                      rows.push(["Dược liệu", herbs.map((h) => `${h.ten}${h.congDung?.length ? `: ${h.congDung[0]}` : ""}`).join(" | ")]);
                      rows.push(["Điều chỉnh theo môi trường", (dieuChinhMoiTruong || []).join(" | ")]);
                      rows.push(["Dấu hiệu nguy hiểm", (dauHieuNguyHiem || []).join(" | ")]);
                      rows.push(["Cảnh báo", warnings.join(" | ")]);
                      rows.push(["Câu hỏi thêm", questions.join(" | ")]);
                      const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
                      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `yhct_${Date.now()}.csv`;
                      a.click();
                      URL.revokeObjectURL(url);
                    };

                    // Trường hợp Tra cứu: hiển thị Hộp dữ liệu nổi bật và bỏ qua phân tích phức tạp
                    if (resp?.mode === "lookup") {
                      const type = resp?.lookup?.type;
                      if (type === "herb") {
                        const herb = resp?.lookup?.herb || herbs[0];
                        return (
                          <>
                            <div className="flex items-center justify-between mb-3">
                              <div className="font-semibold text-purple-200">{`Tra cứu Dược liệu: ${herb?.ten || "—"}`}</div>
                              <button onClick={exportCsv} className="px-2 py-1 rounded-md text-xs border border-purple-400/30 bg-purple-500/10 text-purple-200 hover:border-purple-400/50 transition-all">Xuất CSV</button>
                            </div>
                            <ul className="mt-2 text-sm list-disc list-inside">
                              <li>Tính Vị: {(herb?.vi || []).join(", ") || "—"}; {(herb?.tinh || []).join(", ") || "—"}</li>
                              <li>Quy Kinh: {(herb?.quyKinh || []).join(", ") || "—"}</li>
                              <li>Công năng chính: {(herb?.congDung || [])[0] || "—"}</li>
                              <li>Ứng dụng phổ biến: {(herb?.chiDinh || []).slice(0, 2).join(", ") || "—"}</li>
                              <li>Lưu ý: Không tự ý dùng quá liều; thận trọng khi nội nhiệt/hỏa vượng.</li>
                            </ul>
                            {herb?.ten ? (
                              <a href={`/duoc-lieu?q=${encodeURIComponent(herb.ten)}`} className="mt-2 inline-block underline text-purple-200">Mở trang Dược liệu</a>
                            ) : null}
                            {m.data?.disclaimer ? (
                              <p className="mt-3 text-xs text-white/60">{m.data.disclaimer}</p>
                            ) : null}
                          </>
                        );
                      }
                      if (type === "acupoint") {
                        const acu = resp?.lookup?.acupoint || acupoints[0];
                        return (
                          <>
                            <div className="flex items-center justify-between mb-3">
                              <div className="font-semibold text-purple-200">{`Tra cứu Huyệt đạo: ${acu?.name || "—"}`}</div>
                              <button onClick={exportCsv} className="px-2 py-1 rounded-md text-xs border border-purple-400/30 bg-purple-500/10 text-purple-200 hover:border-purple-400/50 transition-all">Xuất CSV</button>
                            </div>
                            <ul className="mt-2 text-sm list-disc list-inside">
                              <li>Huyệt: <span className="font-semibold">{acu?.name || "—"}</span></li>
                              <li>Công năng chính: {acu?.principle || "—"}</li>
                              <li>Ứng dụng phổ biến: {(acu?.desc || "").split(";")[0] || "—"}</li>
                              <li>Lưu ý: Không bấm quá mạnh; thận trọng nếu có bệnh nền hoặc mang thai.</li>
                            </ul>
                            {m.data?.disclaimer ? (
                              <p className="mt-3 text-xs text-white/60">{m.data.disclaimer}</p>
                            ) : null}
                          </>
                        );
                      }
                      if (type === "disease") {
                        const dis = resp?.lookup?.disease;
                        return (
                          <>
                            <div className="flex items-center justify-between mb-3">
                              <div className="font-semibold text-purple-200">{`Tra cứu Bệnh: ${dis?.ten || "—"}`}</div>
                            </div>
                            <ul className="mt-2 text-sm list-disc list-inside">
                              <li>Mô tả: {dis?.moTa || "—"}</li>
                              <li>Triệu chứng: {(dis?.trieuchung || []).slice(0,4).join(", ") || "—"}</li>
                              {dis?.baiThuocLienQuan?.length ? (
                                <li>Bài thuốc liên quan: {(dis.baiThuocLienQuan || []).slice(0,3).map((b:any)=>b.ten).join(", ")}</li>
                              ) : null}
                            </ul>
                            {dis?.ten ? (
                              <a href={`/benh?q=${encodeURIComponent(dis.ten)}`} className="mt-2 inline-block underline text-purple-200">Mở trang Bệnh</a>
                            ) : null}
                          </>
                        );
                      }
                      if (type === "formula") {
                        const fm = resp?.lookup?.formula;
                        return (
                          <>
                            <div className="flex items-center justify-between mb-3">
                              <div className="font-semibold text-purple-200">{`Tra cứu Bài thuốc: ${fm?.ten || "—"}`}</div>
                            </div>
                            <ul className="mt-2 text-sm list-disc list-inside">
                              <li>Công dụng: {fm?.congDung || "—"}</li>
                              <li>Thành phần: {(fm?.thanhPhan || []).join(", ") || "—"}</li>
                            </ul>
                            {fm?.id ? (
                              <a href={`/bai-thuoc/${encodeURIComponent(fm.id)}`} className="mt-2 inline-block underline text-purple-200">Mở trang Bài thuốc</a>
                            ) : (
                              fm?.ten ? <a href={`/bai-thuoc?q=${encodeURIComponent(fm.ten)}`} className="mt-2 inline-block underline text-purple-200">Tìm trên trang Bài thuốc</a> : null
                            )}
                          </>
                        );
                      }
                    }

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-purple-200">Phản hồi YHCT</div>
                          <button onClick={exportCsv} className="px-2 py-1 rounded-md text-xs border border-purple-400/30 bg-purple-500/10 text-purple-200 hover:border-purple-400/50 transition-all">Xuất CSV</button>
                        </div>
                        <div className="mt-1 text-sm">
                          Cảm ơn bạn. Triệu chứng bạn mô tả có thể liên quan đến {patternName.toLowerCase()}. {etiology}
                        </div>

                        {/* Định hướng trị & Phương pháp */}
                        {(dinhHuong || phuongPhap.length) ? (
                          <div className="mt-2">
                            <div className="font-semibold">Định hướng trị</div>
                            <ul className="mt-1 text-sm list-disc list-inside">
                              {dinhHuong ? (<li>{dinhHuong}</li>) : null}
                              {phuongPhap.length ? (<li>Phương pháp: {phuongPhap.slice(0, 3).join(", ")}</li>) : null}
                            </ul>
                          </div>
                        ) : null}

                        {/* Phân tích Ngũ Hành */}
                        {nguHanh ? (
                          <div className="mt-2">
                            <div className="font-semibold">Ngũ Hành phân tích</div>
                            <div className="mt-1 text-sm">{nguHanh}</div>
                          </div>
                        ) : null}

                        {/* Phần 1: Bấm huyệt hỗ trợ */}
                        {acupoints.length ? (
                          <div className="mt-3 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                            <div className="font-semibold text-cyan-300">Bấm huyệt hỗ trợ</div>
                            <ul className="mt-1 text-sm list-disc list-inside">
                        {acupoints.slice(0, 3).map((p, i) => (
                          <li key={i}><span className="font-semibold">{p.name}</span>: {p.principle || (p.desc || "").split(";")[0]}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                        {/* Phần 2: Dược thiện & Dinh dưỡng */}
                        <div className="mt-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                          <div className="font-semibold text-green-300">Dược thiện & Dinh dưỡng</div>
                          <ul className="mt-1 text-sm list-disc list-inside">
                            <li>Nên dùng: {(nutrition.shouldEat || []).slice(0, 4).join(", ") || "—"}</li>
                            <li>Tránh: {(nutrition.avoid || []).slice(0, 4).join(", ") || "—"}</li>
                            <li>Nguyên tắc: {(nutrition.principles || []).slice(0, 2).join(", ") || "—"}</li>
                          </ul>
                        </div>

                        {/* Điều chỉnh theo mùa/môi trường */}
                        {dieuChinhMoiTruong.length ? (
                          <div className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                            <div className="font-semibold text-blue-300">Điều chỉnh theo mùa/môi trường</div>
                            <ul className="mt-1 text-sm list-disc list-inside">
                              {dieuChinhMoiTruong.slice(0, 3).map((tip, i) => (
                                <li key={i}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {/* Dược liệu tham khảo (ngắn gọn) */}
                        {herbs.length ? (
                          <div className="mt-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
                            <div className="font-semibold text-orange-300">Dược liệu tham khảo</div>
                            <ul className="mt-1 text-sm list-disc list-inside">
                              {herbs.slice(0, 4).map((h, i) => (
                                <li key={i}>
                                  {h.ten}{h.congDung?.length ? ` — Công năng chính: ${h.congDung[0]}` : ""}
                                  {h.sourceLink ? (
                                    <a href={h.sourceLink} className="ml-1 underline">xem chi tiết</a>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {/* Hỏi lại thông minh (nếu cần) */}
                        {questions.length ? (
                          <div className="mt-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                            <div className="font-semibold text-yellow-300">Chúng ta cần biết thêm:</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {questions.map((q, i) => (
                                <button key={i} className="px-2 py-1 rounded-lg text-xs border border-yellow-400/30 bg-yellow-500/10 text-yellow-200 hover:border-yellow-400/50 hover:bg-yellow-500/20 transition-all" onClick={() => setInput(q)}>
                                  {q}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {/* Phần 3: Cảnh báo quan trọng */}
                        {warnings.length ? (
                          <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                            <div className="font-semibold text-red-300">Cảnh báo quan trọng</div>
                            <ul className="mt-1 text-sm list-disc list-inside">
                              {warnings.map((w: string, i: number) => (
                                <li key={i} className="text-red-200">{w}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {/* Dấu hiệu nguy hiểm cần đi viện */}
                        {dauHieuNguyHiem.length ? (
                          <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/40 border-dashed">
                            <div className="font-semibold text-red-400">⚠️ Dấu hiệu nguy hiểm cần đi viện</div>
                            <ul className="mt-1 text-sm list-disc list-inside">
                              {dauHieuNguyHiem.slice(0, 5).map((w: string, i: number) => (
                                <li key={i} className="text-red-200">{w}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {/* Disclaimer bắt buộc */}
                        {m.data?.disclaimer ? (
                          <p className="mt-3 text-xs text-white/60">{m.data.disclaimer}</p>
                        ) : null}
                      </>
                    );
                  })()}
                </div>
              ) : null}

              {m.role === "assistant" && m.data?.disclaimer ? (
                <p className="mt-3 text-xs text-white/60">
                  {m.data.disclaimer}
                </p>
              ) : null}
            </div>
          ))}
        </div>

        {/* Ô nhập liệu */}
        <form
          className="flex items-center gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <input
            className="flex-1 rounded-xl bg-white/8 border border-white/15 px-4 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-500/20 transition-all"
            placeholder="Nhập triệu chứng của bạn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
              loading
                ? "border-white/10 text-white/40 cursor-not-allowed"
                : "border-purple-400/50 text-white bg-purple-500/20 hover:bg-purple-500/30 violet-glow-hover"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <YinYangLoader className="w-5 h-5" />
                Đang xử lý...
              </span>
            ) : (
              "Gửi"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}