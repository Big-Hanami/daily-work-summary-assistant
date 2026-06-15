import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "daily-work-summary-assistant:v1";

type SavedReport = {
  selectedDate: string;
  tasks: string[];
};

const toDateInputValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getInitialReport = (): SavedReport => {
  const fallbackReport: SavedReport = {
    selectedDate: toDateInputValue(new Date()),
    tasks: []
  };

  try {
    const savedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!savedValue) return fallbackReport;

    const savedReport = JSON.parse(savedValue) as Partial<SavedReport>;
    return {
      selectedDate:
        typeof savedReport.selectedDate === "string"
          ? savedReport.selectedDate
          : fallbackReport.selectedDate,
      tasks: Array.isArray(savedReport.tasks)
        ? savedReport.tasks.filter((task): task is string => typeof task === "string")
        : fallbackReport.tasks
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return fallbackReport;
  }
};

const toDisplayDate = (dateInputValue: string): string => {
  const [year, month, day] = dateInputValue.split("-");
  return `${day}/${month}/${year}`;
};

const splitTaskInput = (value: string): string[] =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const buildSummaryText = (selectedDate: string, tasks: string[]): string => {
  const header = `สรุปการทำงาน ${toDisplayDate(selectedDate)}`;
  const lines = tasks.map((task, index) => `${index + 1}.${task}`);
  return [header, ...lines].join("\n");
};

const getDynamicFontSize = (textLength: number): number => {
  if (textLength > 1600) return 14;
  if (textLength > 1000) return 15;
  if (textLength > 600) return 16;
  if (textLength > 300) return 17;
  return 19;
};

export default function App() {
  const [initialReport] = useState<SavedReport>(getInitialReport);
  const [selectedDate, setSelectedDate] = useState<string>(initialReport.selectedDate);
  const [tasks, setTasks] = useState<string[]>(initialReport.tasks);
  const [inputText, setInputText] = useState<string>("");
  const [copyStatus, setCopyStatus] = useState<string>("");
  const summaryTextareaRef = useRef<HTMLTextAreaElement>(null);

  const summaryText = useMemo(
    () => buildSummaryText(selectedDate, tasks),
    [selectedDate, tasks]
  );

  const fontSize = useMemo(
    () => getDynamicFontSize(summaryText.length),
    [summaryText.length]
  );

  useEffect(() => {
    const report: SavedReport = {
      selectedDate,
      tasks
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(report));
  }, [selectedDate, tasks]);

  const addTask = () => {
    const newTasks = splitTaskInput(inputText);
    if (newTasks.length === 0) return;

    setTasks((currentTasks) => [...currentTasks, ...newTasks]);
    setInputText("");
    setCopyStatus("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTask();
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      addTask();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopyStatus("คัดลอกเรียบร้อยแล้ว ✨");
    } catch {
      const textarea = summaryTextareaRef.current;
      if (!textarea) {
        setCopyStatus("คัดลอกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        return;
      }

      textarea.focus();
      textarea.select();

      try {
        const copied = document.execCommand("copy");
        setCopyStatus(copied ? "คัดลอกเรียบร้อยแล้ว ✨" : "เลือกข้อความให้แล้ว กด Ctrl + C เพื่อคัดลอก");
      } catch {
        setCopyStatus("เลือกข้อความให้แล้ว กด Ctrl + C เพื่อคัดลอก");
      }
    }
  };

  const handleClear = () => {
    setTasks([]);
    setInputText("");
    setCopyStatus("");
  };

  return (
    <main className="app-shell">
      <section className="app-card">
        <header className="app-header">
          <div>
            <p className="eyebrow">Daily Work Summary Assistant</p>
            <h1>แอปสรุปงานประจำวัน</h1>
            <p className="subtitle">พิมพ์งานทีละรายการ แล้วให้แอปจัดเลขลำดับให้อัตโนมัติ</p>
          </div>

          <label className="date-picker">
            <span>เลือกวันที่</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              aria-label="เลือกวันที่สรุปงาน"
            />
          </label>
        </header>

        <section className="summary-panel" aria-label="ข้อความสรุปงาน">
          <textarea
            ref={summaryTextareaRef}
            className="summary-textarea"
            value={summaryText}
            readOnly
            style={{ fontSize: `${fontSize}px` }}
          />

          <div className="action-row">
            <button className="primary-button" type="button" onClick={handleCopy}>
              คัดลอก / สรุปงาน
            </button>
            <button className="secondary-button" type="button" onClick={handleClear}>
              ล้างข้อมูล
            </button>
          </div>

          <p className="copy-status" role="status">
            {copyStatus}
          </p>
        </section>

        <form className="input-panel" onSubmit={handleSubmit}>
          <textarea
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="พิมพ์งานที่ทำวันนี้ หรือวางหลายบรรทัดเพื่อเพิ่มหลายรายการ"
            aria-label="ช่องกรอกงานประจำวัน"
          />
          <button className="send-button" type="submit">
            ส่งข้อมูล
          </button>
        </form>
      </section>
    </main>
  );
}
